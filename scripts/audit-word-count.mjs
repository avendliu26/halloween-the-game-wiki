// Block and table boundaries separate words; inline markup must not split them.
export const countContentWords = (root) => {
  const text = (node) => {
    if (node.nodeType === 3) return node.textContent;
    const contents = [...node.childNodes].map(text).join("");
    return /^(P|DIV|SECTION|H[1-6]|LI|TD|TH|TR|BR)$/.test(node.nodeName)
      ? ` ${contents} ` : contents;
  };
  return text(root).trim().split(/\s+/).filter(Boolean).length;
};
