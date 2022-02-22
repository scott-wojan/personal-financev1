/*
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS user_institutions;
DROP TABLE IF EXISTS institutions;
DROP TABLE IF EXISTS users;
*/
CREATE EXTENSION tablefunc;
CREATE EXTENSION citext;

CREATE TABLE IF NOT EXISTS users
(
  id SERIAL PRIMARY KEY,
  email citext UNIQUE NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into users(email) values('test@test.com')


CREATE TABLE IF NOT EXISTS institutions
(
    id text PRIMARY KEY,
    name citext NOT NULL,
    url citext,
    primary_color citext,
    logo citext,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

insert into institutions(id,name) values('usaa','USAA');
insert into institutions(id,name) values('capital_one','Capital One');


CREATE TABLE IF NOT EXISTS user_institutions
(
    item_id text NOT NULL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,    
    institution_id text REFERENCES institutions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    access_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


CREATE TABLE IF NOT EXISTS accounts
(
    id text PRIMARY KEY,
    access_token text NOT NULL,    
    name citext NOT NULL,
    mask citext NOT NULL,
    official_name citext,
    current_balance numeric(28,10),
    available_balance numeric(28,10),
    iso_currency_code citext,
    account_limit numeric(28,10),
    type citext NOT NULL,
    subtype citext NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,    
    institution_id citext REFERENCES institutions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO accounts(id, access_token, name, mask, official_name, current_balance, available_balance, iso_currency_code, account_limit, type, subtype, user_id, institution_id) 
VALUES ('usaa_checking', '12345', 'USAA Checking', '9872', 'USAA Super Checking', null, null, 'USA', null, 'depository', 'checking', 1, 'usaa');

INSERT INTO accounts(id, access_token, name, mask, official_name, current_balance, available_balance, iso_currency_code, account_limit, type, subtype, user_id, institution_id) 
VALUES ('usaa_savings', '67890', 'USAA Savings', '9864', 'USAA Super Sacubgs', null, null, 'USA', null, 'depository', 'savings', 1, 'usaa');

INSERT INTO accounts(id, access_token, name, mask, official_name, current_balance, available_balance, iso_currency_code, account_limit, type, subtype, user_id, institution_id) 
VALUES ('credit_card1', '4325', 'Capital One Venture One', '1036', 'Capital One Venture One', null, null, 'USA', null, 'credit', 'credit card', 1, 'capital_one');

INSERT INTO accounts(id, access_token, name, mask, official_name, current_balance, available_balance, iso_currency_code, account_limit, type, subtype, user_id, institution_id) 
VALUES ('credit_card2', '6334', 'Capital One Venture One', '3381', 'Capital One Venture One', null, null, 'USA', null, 'credit', 'credit card', 1, 'capital_one');


CREATE TABLE IF NOT EXISTS transactions
(
    id text PRIMARY KEY,
    user_id integer references users(id) on delete cascade on update cascade NOT NULL,    
    account_id citext references accounts(id) on delete cascade on update cascade NOT NULL,
    amount numeric(28,10),
    iso_currency_code citext,
    imported_category_id citext,
    imported_category citext,
    imported_subcategory citext,
    imported_name citext,
    category citext,
    subcategory citext,
    name citext,
    check_number citext,
    date date,
    month integer GENERATED ALWAYS AS (date_part('month', date)) STORED,
    year integer GENERATED ALWAYS AS (date_part('year', date)) STORED,
    authorized_date date,
    address citext,
    city citext,
    region citext,
    postal_code citext,
    country citext,
    lat double precision,
    lon double precision,
    store_number citext,
    merchant_name citext,
    payment_channel citext,
    is_pending boolean default false,
    type citext,
    transaction_code citext,
    is_recurring boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


CREATE TYPE plaid_transaction_import as (
  transaction_id text,
  account_id citext, 
  amount numeric(28,10),
  authorized_date date,
  category citext,
  check_number citext,
  date date,
  iso_currency_code citext,
  -- lat double precision,
  -- lon double precision,
  merchant_name citext,
  name citext,
  payment_channel citext,
  pending boolean,
  transaction_code citext,
  transaction_type citext
);


-- CREATE FUNCTION set_transaction_values() RETURNS trigger AS $$
--   BEGIN
--     NEW.month := EXTRACT(MONTH FROM NEW.date);
--     NEW.year := EXTRACT(YEAR FROM NEW.date);
--     NEW.subcategory :=COALESCE(NEW.subcategory, NEW.category || ' General', NEW.subcategory);
--     RETURN NEW;
--   END
-- $$ LANGUAGE plpgsql;


-- CREATE TRIGGER transactions_set_transaction_values
-- BEFORE INSERT OR UPDATE ON transactions
-- FOR EACH ROW EXECUTE PROCEDURE set_transaction_values();


CREATE TABLE IF NOT EXISTS categories
(
  id SERIAL PRIMARY KEY,
  category text,
  subcategory text
);

CREATE UNIQUE INDEX categories_uidx ON categories(category, subcategory);


CREATE TABLE IF NOT EXISTS user_categories
(
  id SERIAL PRIMARY KEY,
  user_id integer references users(id) on delete cascade on update cascade,
  category citext not null,
  subcategory citext,
  user_category citext not null,
  user_subcategory citext
);
CREATE UNIQUE INDEX user_categories_uidx ON user_categories(user_id, category, subcategory);


CREATE TABLE IF NOT EXISTS user_rules
(
  id SERIAL PRIMARY KEY,
  user_id integer references users(id) on delete cascade on update cascade,
  match_column_name citext not null,
  match_condition citext not null,
  match_value citext not null,
  set_column_name citext not null,	
  set_value citext not null
); 
CREATE UNIQUE INDEX user_rules_uidx ON user_rules(user_id, match_column_name, match_condition, match_value);
-- -- starts with
-- select * from transactions
-- where imported_name ~* '^grub.*$';

-- -- ends with
-- select * from transactions
-- where imported_name ~* '.*pharmacy$'

-- -- contains
-- select * from transactions
-- where imported_name ~* '.*life.*$'

-- --equals
-- select * from transactions
-- where imported_name ~* '^COSERV ELECTRIC$'



CREATE OR REPLACE FUNCTION update_transactions(
	userId integer, 
	match_column_name citext, 
	match_condition citext, 
	match_value citext, 
	set_column_name citext,
	set_value citext)
  RETURNS VOID AS
  $$
  DECLARE update_statement TEXT := format('UPDATE transactions SET %s = ''%s'' WHERE user_id = %s and %s %s ''%s'' ',
										  set_column_name, set_value, userId,match_column_name,match_condition,match_value);

  BEGIN
    -- RAISE NOTICE 'sql: %', update_statement;
    EXECUTE update_statement;
  END;
$$ LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION update_user_transactions(userId integer)
RETURNS text
AS $$
BEGIN
-- user categorues
  update transactions
    set category = uc.user_category ,
        subcategory = uc.user_subcategory
  from user_categories uc
  where transactions.user_id = userId
    and uc.user_id = userId
    and transactions.imported_category = uc.category
    and transactions.imported_subcategory = uc.subcategory;
-- rules
RETURN(select update_transactions(1,match_column_name,match_condition,match_value,set_column_name,set_value)
  from user_rules
 where user_id=userId
);
END; $$ 
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION insert_plaid_transactions(userId integer,  JSON)
 RETURNS void 
 LANGUAGE 'plpgsql' 
 COST 100 
 VOLATILE 
 PARALLEL 
 UNSAFE 
AS $BODY$
BEGIN
with transaction_json (doc) as (values($2))
insert into transactions(
	id,
  user_id,
	account_id,
	amount,
	authorized_date,
	imported_category,
	imported_subcategory,
	check_number,
	date,
	iso_currency_code,
	merchant_name,
	imported_name,
	payment_channel,
	is_pending,
	transaction_code,
	type
)
select transaction_id,
       userId as user_id,
       account_id,
		   amount,
		   authorized_date,
	     (ARRAY (select json_array_elements_text(p.category::json)))[1] as category,
	     (ARRAY (select json_array_elements_text(p.category::json)))[2] as subcategory,
		   check_number,
		   date,
		   iso_currency_code,
		   merchant_name,
		   name,
		   payment_channel,
		   pending,
		   transaction_code,
		   transaction_type
from transaction_json l
  cross join lateral json_populate_recordset(null::plaid_transaction_import, doc) as p
ON CONFLICT (ID)
DO UPDATE SET
   account_id = excluded.account_id,
   amount = excluded.amount,
   authorized_date = excluded.authorized_date,
   category = excluded.category,
   subcategory = excluded.subcategory,
   check_number = excluded.check_number,
   date = excluded.date,
   iso_currency_code = excluded.iso_currency_code,
   merchant_name = excluded.merchant_name,
   name = excluded.name,
   payment_channel = excluded.payment_channel,
   is_pending = excluded.is_pending,
   transaction_code = excluded.transaction_code,
   type=excluded.type;

   execute update_user_transactions(userId);

   END;
$BODY$;


-- update transactions
--   set category = uc.user_category ,
--       subcategory = uc.user_subcategory
--  from user_categories uc
-- where transactions.user_id = 1
--   and transactions.category = uc.category
--   and transactions.subcategory = uc.subcategory


CREATE OR REPLACE FUNCTION get_spending_metrics_by_category_subcategory(
  userId integer,
  startYear integer,
  startMonth integer,
  endMonth integer
) RETURNS TABLE (
  category citext,
  subcategory citext,
  min numeric(28, 2),
  max numeric(28, 2),
  avg numeric(28, 2)
) AS $$ 
BEGIN 
RETURN QUERY
select
  ledger.category,
  ledger.subcategory,
  sum(ledger.min) min,
  sum(ledger.max) max,
  sum(ledger.avg) avg
from
  (
    select
      t.category,
      t.subcategory,
      round(max(t.total), 2) min,
      round(min(t.total), 2) max,
      round(avg(t.total), 2) avg
    from(
        select
          months.month,
          user_categories.category,
          user_categories.subcategory,
          coalesce(round(sum(t.amount), 2), 0) as total
        from
          generate_series(startMonth, endMonth) as months(month)
          cross join (
            select
              t.category,
              t.subcategory
            from
              transactions t
              inner join accounts a on a.id = t.account_id
            where
              a.user_id = userId
              and t.year = startYear
              and month between startMonth
              and endMonth
              and amount < 0
            group by
              t.category,
              t.subcategory
            order by
              t.category,
              t.subcategory
          ) as user_categories
          left join transactions t on t.month = months.month
          and t.category = user_categories.category
          and t.subcategory = user_categories.subcategory
          and amount < 0
        group by
          months.month,
          user_categories.category,
          user_categories.subcategory
      ) t
    GROUP BY
      t.category,
      t.subcategory
    UNION
    select
      t.category,
      t.subcategory,
      round(min(t.total), 2) min,
      round(max(t.total), 2) max,
      round(avg(t.total), 2) avg
    from(
        select
          months.month,
          user_categories.category,
          user_categories.subcategory,
          coalesce(round(sum(t.amount), 2), 0) as total
        from
          generate_series(1, 12) as months(month)
          cross join (
            select
              t.category,
              t.subcategory
            from
              transactions t
              inner join accounts a on a.id = t.account_id
            where
              a.user_id = userId
              and t.year = startYear
              and month between startMonth
              and endMonth
              and amount > 0
            group by
              t.category,
              t.subcategory
            order by
              t.category,
              t.subcategory
          ) as user_categories
          left join transactions t 
	        on t.month = months.month
           and t.category = user_categories.category
           and t.subcategory = user_categories.subcategory
           and amount > 0
        group by
          months.month,
          user_categories.category,
          user_categories.subcategory
        order by
          months.month,
          user_categories.category,
          user_categories.subcategory
      ) t
    GROUP BY
      t.category,
      t.subcategory
  ) as ledger
GROUP BY
  ledger.category,
  ledger.subcategory
ORDER BY
  ledger.category,
  ledger.subcategory;
END;$$ 
LANGUAGE 'plpgsql';

-- select * from GetSpendingMetricsByCategoryAndSubcategory(1,2021,1,12)






-- starts with
select * from transactions
where imported_name ~* '^grub.*$';

-- ends with
select * from transactions
where imported_name ~* '.*pharmacy$'

-- contains
select * from transactions
where imported_name ~* '.*life.*$'

--equals
select * from transactions
where imported_name ~ '^COSERV ELECTRIC$'







WITH spending AS (
 SELECT * FROM crosstab(
     $$ select category || '>' || subcategory,
	           to_char(date, 'mon'), 
	           round(sum(amount),2) AS total
          from transactions
         inner join accounts on accounts.id = transactions.account_id
	     where user_id = 1
	       and year = 2021
	       and month between 1 and 12
         group by category,subcategory,2
         order by 1,2 
	 $$
    ,$$VALUES ('jan'), ('feb'), ('mar'), ('apr'), ('may'), ('jun'), ('jul'), ('aug'), ('sep'), ('oct'), ('nov'), ('dec')$$
   )
 AS ct (category citext, jan numeric(28,2), feb numeric(28,2), mar numeric(28,2), apr numeric(28,2), may numeric(28,2), jun numeric(28,2), jul numeric(28,2), aug numeric(28,2), sep numeric(28,2), oct numeric(28,2), nov numeric(28,2), dec numeric(28,2))	
)
SELECT 
    (regexp_split_to_array(category, '>'))[1] as category, 
    (regexp_split_to_array(category, '>'))[2] as subcategory, 
    COALESCE(jan, 0) jan,
    COALESCE(feb, 0) feb,
    COALESCE(mar, 0) mar,
    COALESCE(apr, 0) apr,
    COALESCE(may, 0) may,
    COALESCE(jun, 0) jun,
    COALESCE(jul, 0) jul,
    COALESCE(aug, 0) aug,
    COALESCE(sep, 0) sep,
    COALESCE(oct, 0) oct,
    COALESCE(nov, 0) nov,
    COALESCE(dec, 0) dec,
	round((
		COALESCE(jan, 0) +
		COALESCE(feb, 0) +
		COALESCE(mar, 0) +
		COALESCE(apr, 0) +
		COALESCE(may, 0) +
		COALESCE(jun, 0) +
		COALESCE(jul, 0) +
		COALESCE(aug, 0) +
		COALESCE(sep, 0) +
		COALESCE(oct, 0) +
		COALESCE(nov, 0) +
		COALESCE(dec, 0)		
	)/12,2) as yearly_average
FROM spending;




























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
SELECT subcategory, sum(t.amount) as amount
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
           SELECT t.id, t.date, t.name, t.amount, t.category, t.subcategory, t.iso_currency_code
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
           SELECT t.id, t.date, t.name, t.amount, t.category, t.subcategory, t.iso_currency_code
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
           SELECT t.id, t.date, t.name, t.amount, t.category, t.subcategory, t.iso_currency_code
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

CREATE OR REPLACE FUNCTION get_account_transactions_by_daterange(userId integer, accountId text, startDate date, endDate date, off_set integer, limitBy integer)
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
           SELECT t.id, t.date, t.name, t.amount, t.category, t.subcategory, t.iso_currency_code
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