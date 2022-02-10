import Page from "components/Page";
import React from "react";

export default function AppPage({
  title = undefined,
  description = undefined,
  children = undefined,
}) {
  return (
    <Page
      title={title}
      description={description}
      header={<div>Header</div>}
      // footer={<div>Footer</div>}
      // left={<div></div>}
      // right={<div></div>}
    >
      <>{children}</>
    </Page>
  );
}
