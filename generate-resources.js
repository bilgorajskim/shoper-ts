[...$0.querySelectorAll(":scope > li")].map((resource_node) => {
  const href = resource_node.querySelector(":scope > a").href;
  const href_splitted = href.split("/");
  const name = href_splitted[href_splitted.length - 1];
  const method_nodes = resource_node.querySelectorAll(":scope ul li > a");
  const methods = [...method_nodes].map((method_node) =>
    method_node.innerText.toUpperCase()
  );
  return {
    name,
    methods,
  };
});
