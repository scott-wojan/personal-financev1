import Head from "next/head";
import React from "react";

export default function Page({
  title = undefined,
  description = undefined,
  header = undefined,
  navigation = undefined,
  left = undefined,
  right = undefined,
  children = undefined,
  footer = undefined,
}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
      </Head>
      <div className="flex flex-col w-screen h-screen">
        <header className="">{header}</header>
        <nav className="">{navigation}</nav>
        <div className="flex flex-auto">
          <aside className="">{left}</aside>
          <main className="flex flex-col flex-1">{children}</main>
          <aside className="">{right}</aside>
        </div>
        <footer className="">{footer}</footer>
      </div>
    </>
  );
}
