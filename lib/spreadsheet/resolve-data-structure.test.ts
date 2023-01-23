import {
  compareHeaderRows,
  resolveDataStructure,
  createAlignFunction,
  headerRowIntersection,
  formatData
} from "./resolve-data-structure";

describe("compareHeaderRows", () => {
  it("returns true if the headers are the same", () => {
    const header1 = ["name", "age"];
    const header2 = ["name", "age"];
    expect(compareHeaderRows(header1, header2)).toBe(true);
  });
  it("returns false if the headers are different length.", () => {
    const header1 = ["name", "age"];
    const header2 = ["name", "age", "height"];
    expect(compareHeaderRows(header1, header2)).toBe(false);
  });
  it("returns false if the headers are different", () => {
    const header1 = ["name", "age"];
    const header2 = ["name", "height"];
    expect(compareHeaderRows(header1, header2)).toBe(false);
  });
});

describe("headerRowIntersection", () => {
  it("returns the intersection of the headers", () => {
    const header1 = ["name", "age"];
    const header2 = ["name", "height"];
    expect(headerRowIntersection(header1, header2)).toEqual(["name"]);
  });
});

describe("createAlignFunction", () => {
  it("returns a function that aligns the data to the mold", () => {
    const mold = ["name", "age"];
    const header = ["age", "name"];
    const align = createAlignFunction(mold, header);
    const row = [40, "bob"];
    const result = align(row);
    expect(result).toEqual(["bob", 40]);
  });

  it("returns a function that aligns the data to the mold", () => {
    const mold = ["name", "age", "height"];
    const header = ["age", "name"];
    const align = createAlignFunction(mold, header);
    const row = [40, "bob"];
    const result = align(row);
    expect(result).toEqual(["bob", 40, ""]);
  });

  it("returns a function that aligns the data to the mold", () => {
    const mold = ["name", "age", "height"];
    const header = ["age", "name", "height", "weight"];
    const align = createAlignFunction(mold, header);
    const row = [40, "bob", 5.5, 150];
    const result = align(row);
    expect(result).toEqual(["bob", 40, 5.5]);
  });

  it("returns a function that aligns the data to the mold case insensitive", () => {
    const mold = ["name", "age", "height"];
    const header = ["AGE", "NAME", "HEIGHT", "WEIGHT"];
    const align = createAlignFunction(mold, header);
    const row = [40, "bob", 5.5, 150];
    const result = align(row);
    expect(result).toEqual(["bob", 40, 5.5]);
  });
});

describe("formatData", () => {
    it("formats the data", () => {
        const data = {
            description: "My Description",
            title: "My Title",
            price: 100,
        }

        const result = formatData(data, "OBJECT")
        expect(result).toEqual([["My Description", "My Title", 100]])
    })

    it("formats the data with an align function", () => {
        const data = {
            description: "My Description",
            title: "My Title",
            price: 100,
        }

        const align = createAlignFunction(["title", "description", "price"], Object.keys(data))

        const result = formatData(data, "OBJECT", align)
        expect(result).toEqual([["My Title", "My Description", 100]])
    })
})

describe("resolveDataStructure", () => {
  it("turns an array objects into an array of arrays", () => {
    const data = [
      { name: "alice", age: 30 },
      { name: "bob", age: 40 },
    ];
    const result = resolveDataStructure(data, {
      mold: ["name", "age"],
      crucialKeys: ["name", "age"],
    });

    console.log(result);

    expect(result).toEqual([
      ["alice", 30],
      ["bob", 40],
    ]);
  });

  it("takes an object, make sure it has the crucial keys, and properly formats it", () => {
    const data = {
      description: "My Description",
      title: "My Title",
      price: 100,
      id: 1,
      lat: 40,
      lng: -80,
    };

    const result = resolveDataStructure(data, {
      mold: ["id", "title", "price", "lat", "lng"],
      crucialKeys: ["id", "title", "price", "lat", "lng"],
    });
    expect(result).toEqual([[1, "My Title", 100, 40, -80]]);
  });
});
