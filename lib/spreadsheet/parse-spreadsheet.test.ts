import { parseSpreadsheet } from "./parse-spreadsheet"

describe("parseSpreadsheet", () => {
  it("parses a spreadsheet", () => {
    const spreadsheet = [
      ["name", "age"],
      ["alice", 30],
      ["bob", 40],
    ]
    const [header, ...data] = spreadsheet
    const result = parseSpreadsheet(data, header as string[])
    expect(result).toEqual([
      { name: "alice", age: 30 },
      { name: "bob", age: 40 },
    ])
  })
})
