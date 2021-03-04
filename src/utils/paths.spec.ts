import {
  cleanBasePath,
  getQueryAsObject,
  sanitisePath,
  splitFullPath
} from "./paths";

describe("utils/paths", () => {
  describe("sanitisePath", () => {
    it("Appends slash to start", () => {
      const path: string = "ping";
      const routePath = sanitisePath(path);
      expect(routePath).toEqual("/ping");
    });

    it("Appends slash to start after trimming text", () => {
      const path: string = " ping ";
      const routePath = sanitisePath(path);
      expect(routePath).toEqual("/ping");
    });

    it("Removes slash from end", () => {
      const path: string = "/ping/";
      const routePath = sanitisePath(path);
      expect(routePath).toEqual("/ping");
    });

    it("Removes query", () => {
      const path: string = "/ping?test=case";
      const routePath = sanitisePath(path);
      expect(routePath).toEqual("/ping");
    });

    it("Removes query and trailing slash", () => {
      const path: string = "/ping/?test=case";
      const routePath = sanitisePath(path);
      expect(routePath).toEqual("/ping");
    });

    // it('Removes path params', () => {
    //   const path: string = '/ping/:text?test=case'
    //   const routePath = sanitisePath(path)
    //   expect(routePath).toEqual('/ping/:')
    //
    //   expect(sanitisePath('/ping/:test/:case').routePath).toEqual('/ping/:/:')
    //   expect(sanitisePath('/ping/:test/:case/end').routePath).toEqual('/ping/:/:/end')
    // })
  });

  describe("splitFullPath", () => {
    it("Split a path and query", () => {
      expect(splitFullPath("/test/case?param1=bob&param2=frank")).toEqual({
        path: "/test/case",
        query: "param1=bob&param2=frank"
      });
    });

    it("Split a path and query without leading slash", () => {
      expect(splitFullPath("test/case?param1=bob&param2=frank")).toEqual({
        path: "/test/case",
        query: "param1=bob&param2=frank"
      });
    });

    it("Split a path and query with trailing slash", () => {
      expect(splitFullPath("/test/case/?param1=bob&param2=frank")).toEqual({
        path: "/test/case",
        query: "param1=bob&param2=frank"
      });
    });

    it("Return only path if query missing", () => {
      expect(splitFullPath("/test/case/")).toEqual({
        path: "/test/case",
        query: ""
      });
    });

    it("Return only path if query missing but includes ?", () => {
      expect(splitFullPath("/test/case/?")).toEqual({
        path: "/test/case",
        query: ""
      });
    });

    it("Return query if path missing", () => {
      expect(splitFullPath("?param1=bob&param2=frank")).toEqual({
        path: "",
        query: "param1=bob&param2=frank"
      });
    });

    it("Return query and path when path is root", () => {
      expect(splitFullPath("/?param1=bob&param2=frank")).toEqual({
        path: "/",
        query: "param1=bob&param2=frank"
      });
    });
    // it ('',()=>{
    //   expect(splitFullPath()).toEqual()
    // })
    //
    // it ('',()=>{
    //   expect(splitFullPath()).toEqual()
    // })
  });

  describe("getQueryAsObject", () => {
    it("Should convert a query string into an object", () => {
      expect(getQueryAsObject("?test=case")).toEqual({ test: "case" });
    });

    it("Should convert a query string into an object without a leading ?", () => {
      expect(getQueryAsObject("test=case")).toEqual({ test: "case" });
    });

    it("Should convert a query string with multiple items into an object", () => {
      expect(getQueryAsObject("test=case&name=bob&count=2")).toEqual({
        test: "case",
        name: "bob",
        count: "2"
      });
    });

    it("Should return an empty object if no query string", () => {
      expect(getQueryAsObject("")).toEqual({});
    });

    it("Should return an empty string from props that have no value", () => {
      expect(getQueryAsObject("test")).toEqual({ test: "" });
    });

    it("Should handle a mix of values and missing values", () => {
      expect(getQueryAsObject("test&count=2")).toEqual({
        test: "",
        count: "2"
      });
    });
  });

  describe("cleanBasePath", () => {
    it("Should return an empty string if single slash", () => {
      expect(cleanBasePath("/")).toEqual("");
    });

    it("Should return an empty string if string empty", () => {
      expect(cleanBasePath("  ")).toEqual("");
    });

    it("Should return an empty string if only contains single slash", () => {
      expect(cleanBasePath("  /  ")).toEqual("");
    });

    it("Should remove a trailing slash slash", () => {
      expect(cleanBasePath("/bob/")).toEqual("/bob");
    });

    it("Should add a leading slash", () => {
      expect(cleanBasePath("bob")).toEqual("/bob");
    });

    it("Should add a leading slash and remove trailing slash", () => {
      expect(cleanBasePath("bob/")).toEqual("/bob");
    });

    it("Should remove any padding behind the trailing slash", () => {
      expect(cleanBasePath("/bob  /")).toEqual("/bob");
    });
  });
});
