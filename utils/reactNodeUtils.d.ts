import React from "react";
/**
 * Recursively extracts plain text content from a ReactNode.
 * Useful for searching within arbitrary JSX labels.
 */
export declare const extractTextFromReactNode: (node: React.ReactNode) => string;
/**
 * Recursively highlights occurrences of a search term within a ReactNode.
 * Only highlights within string nodes.
 */
export declare const highlightReactNode: (node: React.ReactNode, searchTerm: string, highlightClassName: string) => React.ReactNode;
