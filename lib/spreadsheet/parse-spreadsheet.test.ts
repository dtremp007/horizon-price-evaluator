import { parseSpreadsheet } from "./parse-spreadsheet"

describe("parseSpreadsheet", () => {
  it("parses a spreadsheet", () => {
    const spreadsheet = [
      ["name", "age"],
      ["alice", 30],
      ["bob", 40],
    ]
    const result = parseSpreadsheet(spreadsheet)
    expect(result).toEqual([
      { name: "alice", age: 30 },
      { name: "bob", age: 40 },
    ])
  })
})
