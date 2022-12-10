export function getSheetIdFromLink(link?: string): string | null {
    if (link === undefined) {
      // If the link is undefined, return null.
      return null;
    }
    // Use a regular expression to extract the part of the link that
    // contains the sheet ID. The regular expression looks for the
    // "spreadsheets/d/" part of the link, followed by some characters
    // that represent the sheet ID, followed by a "/".
    const matches = link.match(/spreadsheets\/d\/([^/]+)/);
    if (matches === null || matches.length < 2) {
      // If the regular expression didn't match or if it matched but
      // there was no sheet ID in the second match group, return null.
      return null;
    }

    // Return the sheet ID, which is the second match group of the regular
    // expression.
    return matches[1];
  }
