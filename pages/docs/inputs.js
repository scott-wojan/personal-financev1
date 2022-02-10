export default function Inputs() {
  return (
    <div>
      <div className="px-6 antialiased ">
        <div className="max-w-xl py-12 mx-auto divide-y md:max-w-4xl">
          <div className="py-8">
            <h1 className="text-4xl font-bold">@tailwindcss/forms examples</h1>
            <p className="mt-2 text-lg ">
              An opinionated form reset designed to make form elements easy to
              style with utility classes.
            </p>
          </div>

          <div className="py-12">
            <h2 className="text-2xl font-bold">Form Inputs</h2>
            <p className="mt-2 text-lg ">
              This is how form elements look out of the box.
            </p>
            <div className="max-w-md mt-8">
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span>input="text"</span>
                  <input type="text" className="w-full " placeholder="" />
                </label>
                <label className="block">
                  <span>input="email"</span>
                  <input
                    type="email"
                    className="w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label className="block">
                  <span>input="date"</span>
                  <input type="date" className="w-full" />
                </label>
                <label className="block">
                  <span>select</span>
                  <select className="w-full">
                    <option>Corporate event</option>
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span>textarea</span>
                  <textarea className="w-full" rows="3"></textarea>
                </label>
                <div className="block">
                  <div className="mt-1">
                    <span>input="checkbox"</span>
                    <div>
                      <label className="inline-flex items-center">
                        <input type="checkbox" defaultChecked />
                        <span className="ml-2">
                          Email me news and special offers
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
