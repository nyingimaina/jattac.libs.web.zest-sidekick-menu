import React from "react";

/**
 * Escapes special characters in a string for safe usage in a RegExp.
 */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Recursively extracts plain text content from a ReactNode.
 * Useful for searching within arbitrary JSX labels.
 */
export const extractTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    const children = React.Children.toArray(props.children ?? []);
    return children.map(extractTextFromReactNode).join("");
  }

  return "";
};

/**
 * Recursively highlights occurrences of a search term within a ReactNode.
 * Only highlights within string nodes.
 */
export const highlightReactNode = (
  node: React.ReactNode,
  searchTerm: string,
  highlightClassName: string
): React.ReactNode => {
  if (!searchTerm) return node;

  const safeSearchTerm = escapeRegExp(searchTerm);
  const regex = new RegExp(safeSearchTerm, "gi");

  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      parts.push(
        <span
          key={`highlight-${match.index}-${parts.length}`}
          className={highlightClassName}
        >
          {match[0]}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }

  if (Array.isArray(node)) {
    return node.map((child) =>
      highlightReactNode(child, searchTerm, highlightClassName)
    );
  }

  if (React.isValidElement(node)) {
    const originalType = node.type;

    if (originalType === React.Fragment) {
      const props = node.props as { children?: React.ReactNode };
      const children = React.Children.toArray(props.children ?? []);
      const highlighted = children.map((child) =>
        highlightReactNode(child, searchTerm, highlightClassName)
      );
      return <React.Fragment>{highlighted}</React.Fragment>;
    }

    const element = node as React.ReactElement<any>;
    const children = React.Children.toArray(element.props.children).map(
      (child) => highlightReactNode(child, searchTerm, highlightClassName)
    );

    return React.cloneElement(element, { ...element.props, children });
  }

  return node;
};
