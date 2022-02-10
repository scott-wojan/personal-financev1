/*
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS user_institutions;
DROP TABLE IF EXISTS institutions;
DROP TABLE IF EXISTS users;
*/

CREATE TABLE IF NOT EXISTS categories
(
  id text PRIMARY KEY,
  category text,
  category_sub text
);

CREATE TABLE IF NOT EXISTS users
(
  id SERIAL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


CREATE TABLE IF NOT EXISTS institutions
(
    id text PRIMARY KEY,
    name text NOT NULL,
    url text,
    primary_color text,
    logo text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


CREATE TABLE IF NOT EXISTS accounts
(
    id text PRIMARY KEY,
    access_token text NOT NULL,    
    name text NOT NULL,
    mask text NOT NULL,
    official_name text,
    current_balance numeric(28,10),
    available_balance numeric(28,10),
    iso_currency_code text,
    account_limit numeric(28,10),
    type text NOT NULL,
    subtype text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,    
    institution_id text REFERENCES institutions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE transactions
(
  id text PRIMARY KEY,	
  account_id text REFERENCES accounts(id) ON DELETE CASCADE,
  amount numeric(28,10),
  iso_currency_code text,	
  category_id text,
  category text,
  category_sub text,
  check_number text,
  date date,
  month int,
  year int,
  authorized_date date,
  address text,
  city text,
  region text,
  postal_code text,
  country text,
  lat float,
  lon float,
  store_number text,
  name text,
  merchant_name text,
  payment_channel text,
  pending boolean,
  type text,
  transaction_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS user_institutions
(
    item_id text NOT NULL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,    
    institution_id text REFERENCES institutions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    access_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


CREATE FUNCTION set_transaction_values() RETURNS trigger AS $$
  BEGIN
    NEW.month := EXTRACT(MONTH FROM NEW.date);
    NEW.year := EXTRACT(YEAR FROM NEW.date);
    NEW.category_sub :=COALESCE(NEW.category_sub, NEW.category || ' General', NEW.category_sub);
    RETURN NEW;
  END
$$ LANGUAGE plpgsql;


CREATE TRIGGER transactions_set_transaction_values
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE set_transaction_values();


CREATE OR REPLACE FUNCTION GetSpendingByCategory(userId integer, startDate date, endDate date)
RETURNS TABLE (
 category text,
 amount numeric(28,10)
)
AS $$
BEGIN
RETURN QUERY select t.category, sum(t.amount) as amount
  from transactions t
 INNER JOIN accounts a on a.id = t.account_id
 WHERE a.user_id = userId
   and date between startDate and endDate
   and t.category != 'Payment'
   and t.category != 'Transfer'
   and t.category != 'Interest'
 GROUP BY t.category;
END; $$ 
LANGUAGE 'plpgsql';






CREATE OR REPLACE FUNCTION GetSpendingBySubCategory(userId integer, category text, startDate date, endDate date)
RETURNS TABLE (
 sub_category text,
 amount numeric(28,10)
)
AS $$
BEGIN
RETURN QUERY 
SELECT category_sub, sum(t.amount) as amount
  FROM transactions t
 INNER JOIN accounts a on a.id = t.account_id  
 WHERE a.user_id = userId
   and t.category = $2
   and t.date between startDate and endDate
   and t.category != 'Payment'
   and t.category != 'Transfer'
   and t.category != 'Interest'   
 group by sub_category;
END; $$ 
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION GetSpendingByDates(userId integer, startDate date, endDate date)
RETURNS TABLE (
 date text,
 amount numeric(28,10)
)
AS $$
BEGIN
RETURN QUERY 
	SELECT to_char(summed_transactions.date, 'Mon YYYY') date , sum(summed_transactions.amount) amount 
	FROM (
		SELECT t.date, to_date(to_char(t.date, 'Mon YYYY'), 'Mon YYYY') formatted_date, sum(t.amount) amount
		  FROM transactions t
	 INNER JOIN accounts a on a.id = t.account_id
		  WHERE a.user_id = userId
		   and t.category != 'Payment'
		   and t.category != 'Transfer'
		   and t.category != 'Interest'
		 group by t.date
		 order by t.date desc
	) as summed_transactions
	group by 1, summed_transactions.formatted_date
	order by summed_transactions.formatted_date desc;
END; $$ 
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION GetTransactions(userId integer, page integer)
RETURNS TABLE (
 total bigint,
 data json	
)
AS $$
BEGIN
RETURN QUERY 
    SELECT
    (SELECT COUNT(t.*)
       FROM transactions t
	  INNER JOIN accounts a on a.id = t.account_id
	  WHERE a.user_id = userId
    ) as count, 
    (SELECT json_agg(t.*) 
       FROM (
           SELECT t.id, t.date, t.name, t.amount, t.category, t.category_sub, t.iso_currency_code
		     FROM transactions t
	        INNER JOIN accounts a on a.id = t.account_id		   
		   	WHERE a.user_id = userId
            ORDER BY date desc
           OFFSET page - 1 --use 1 based indexing to match UI
            LIMIT 100
     ) AS t
    ) AS data;
END; $$ 
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION GetTransactionsByDateRange(userId integer, page integer, startDate date, endDate date)
RETURNS TABLE (
 total bigint,
 data json	
)
AS $$
BEGIN
RETURN QUERY 
    SELECT
    (SELECT COUNT(t.*)
       FROM transactions t
	  INNER JOIN accounts a on a.id = t.account_id
	  WHERE a.user_id = userId
        AND date BETWEEN startDate AND endDate
    ) as count, 
    (SELECT json_agg(t.*) 
       FROM (
           SELECT t.id, t.date, t.name, t.amount, t.category, t.category_sub, t.iso_currency_code
		     FROM transactions t
	        INNER JOIN accounts a on a.id = t.account_id		   
		   	WHERE a.user_id = userId
              AND date BETWEEN startDate AND endDate		   
            ORDER BY date desc
           OFFSET page - 1 --use 1 based indexing to match UI
            LIMIT 100
     ) AS t
    ) AS data;
END; $$ 
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION GetAccountTransactions(userId integer, accountId text, page integer)
RETURNS TABLE (
 total bigint,
 data json	
)
AS $$
BEGIN
RETURN QUERY 
    SELECT
    (SELECT COUNT(t.*)
       FROM transactions t
	  INNER JOIN accounts a on a.id = t.account_id
	  WHERE a.user_id = userId
	    AND a.id = accountId
    ) as count, 
    (SELECT json_agg(t.*) 
       FROM (
           SELECT t.id, t.date, t.name, t.amount, t.category, t.category_sub, t.iso_currency_code
		     FROM transactions t
	        INNER JOIN accounts a on a.id = t.account_id		   
		   	WHERE a.user_id = userId
	          AND a.id = accountId		   
            ORDER BY date desc
           OFFSET page - 1 --use 1 based indexing to match UI
            LIMIT 100
     ) AS t
    ) AS data;
END; $$ 
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION GetAccountTransactionsByDateRange(userId integer, accountId text, startDate date, endDate date, off_set integer, limitBy integer)
RETURNS TABLE (
 total bigint,
 data json	
)
AS $$
BEGIN
RETURN QUERY 
    SELECT
    (SELECT COUNT(t.*)
       FROM transactions t
	  INNER JOIN accounts a on a.id = t.account_id
	  WHERE a.user_id = userId
	    AND a.id = accountId	 
        AND date BETWEEN startDate AND endDate
    ) as count, 
    (SELECT json_agg(t.*) 
       FROM (
           SELECT t.id, t.date, t.name, t.amount, t.category, t.category_sub, t.iso_currency_code
		     FROM transactions t
	        INNER JOIN accounts a on a.id = t.account_id		   
		   	WHERE a.user_id = userId
		   	  AND a.id = accountId
              AND date BETWEEN startDate AND endDate		   
            ORDER BY date desc
           OFFSET off_set
            LIMIT limitBy
     ) AS t
    ) AS data;
END; $$ 
LANGUAGE 'plpgsql';




SELECT
  (SELECT COUNT(*)
     FROM transactions
    WHERE  account_id = 'mzd5mpxAonCE3NpPmvLEFGdj1dEogWhLkpzbA'
  ) as count, 
  (SELECT json_agg(t.*) 
     FROM (
	       SELECT * FROM transactions
	        WHERE  account_id = 'mzd5mpxAonCE3NpPmvLEFGdj1dEogWhLkpzbA'
	        ORDER BY date
	       OFFSET 0
	        LIMIT 5
	 ) AS t
  ) AS rows


 select date_trunc('month', t.date) as month, category, sum(amount) amount
  from transactions t 
  group by 1, 2
  order by 1 desc, 2;

select distinct category, 
       avg(sum(amount)) over (partition by category)  amount
  from (
	    select category, 
	           amount,
	           date
    from transactions
 INNER JOIN accounts a on a.id = account_id
 WHERE a.user_id = 1
   and date between '2021/11/01' and '2021/11/30' 	  
  ) x
 group by date_trunc('month', date), category
 
 select distinct t.category, avg(sum(t.amount)) over (partition by t.category)  amount
  from transactions t
 INNER JOIN accounts a on a.id = t.account_id
 WHERE a.user_id = 1
   and date between '2021/11/01' and '2021/11/30' 
 group by date_trunc('month', t.date), category
 order by 1;



  
select distinct category, 
       avg(sum(amount)) over (partition by category)  amount
  from (
	    select category,
	      amount,
	  date
    from transactions
 INNER JOIN accounts a on a.id = account_id
 WHERE a.user_id = 1
   and date between '2021/11/01' and '2021/11/30' 	  
  ) x
 group by date_trunc('month', date), category;  



 -- Category spend trends year over year
select year, 
       month, 
       category, 
	   average_amount,
	   lag(average_amount, 1) OVER (PARTITION BY month, category ORDER BY year, month ) as previous_year,
	   lag(average_amount, 1) OVER (PARTITION BY month, category ORDER BY year, month ) - average_amount as difference,
       (100 * (average_amount - lag(average_amount, 1) over (PARTITION BY month, category ORDER BY year, month)) / lag(average_amount, 1) over (PARTITION BY month, category ORDER BY year, month)) as percent_diff
from (
	select distinct year, month, 
		   category,
		   avg(amount) OVER (PARTITION BY month, category ORDER BY year, month) average_amount
	from transactions
	order by category, month
) t

-- Category spend trends by month
select month, 
       category, 
	   average_amount,
	   lag(average_amount, 1) OVER (PARTITION BY month, category ORDER BY month ) as previous_month
from (
	select distinct month, 
		   category,
		   avg(amount) OVER (PARTITION BY month, category ORDER BY month ) as average_amount
	from transactions
	where year = 2021
	order by category, month
) t