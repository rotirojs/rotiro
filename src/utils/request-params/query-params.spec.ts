import { Endpoints } from "../../classes";
import { Mappers } from "../../classes/mappers";
import { ApiRequestParam, MethodSchemaParam } from "../../type-defs";
import { getQueryParams } from "./query-params";

describe("utils/request-params/query-params", () => {
  let mappers;
  let endpoints: Endpoints;
  beforeEach(() => {
    endpoints = new Endpoints();
    mappers = new Mappers();
  });

  describe("getQueryParams", () => {
    it("Should match a parameter in the query", () => {
      const querySchema: MethodSchemaParam[] = [{ name: "id", type: "string" }];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        "?id=frank",
        querySchema,
        mappers
      );
      expect(result).toEqual({
        id: {
          name: "id",
          type: "string",
          valid: true,
          value: "frank"
        }
      });
    });

    it("Should match a number parameter in the query", () => {
      const querySchema: MethodSchemaParam[] = [{ name: "id", type: "number" }];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        "?id=23",
        querySchema,
        mappers
      );
      expect(result).toEqual({
        id: {
          name: "id",
          type: "number",
          valid: true,
          value: 23
        }
      });
    });

    it("Should match multiple parameter in the query", () => {
      const querySchema: MethodSchemaParam[] = [
        { name: "id", type: "number" },
        { name: "color", type: "string" }
      ];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        "?id=23&color=blue",
        querySchema,
        mappers
      );
      expect(result).toEqual({
        id: {
          name: "id",
          type: "number",
          valid: true,
          value: 23
        },
        color: {
          name: "color",
          type: "string",
          valid: true,
          value: "blue"
        }
      });
    });

    it("Should ignore additional parameter in the query", () => {
      const querySchema: MethodSchemaParam[] = [
        { name: "id", type: "number" },
        { name: "color", type: "string" }
      ];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        "?id=23&color=blue&extra=true",
        querySchema,
        mappers
      );
      expect(result).toEqual({
        id: {
          name: "id",
          type: "number",
          valid: true,
          value: 23
        },
        color: {
          name: "color",
          type: "string",
          valid: true,
          value: "blue"
        }
      });
    });

    it("Should match an object parameter in the query", () => {
      const querySchema: MethodSchemaParam[] = [{ type: "json", name: "id" }];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        `?id=${encodeURIComponent(JSON.stringify({ name: "James" }))}`,
        querySchema,
        mappers
      );

      expect(result).toEqual({
        id: {
          name: "id",
          type: "json",
          valid: true,
          value: { name: "James" }
        }
      });
    });

    it("Should return an array if array passed in", () => {
      const querySchema = [{ type: "string", name: "id", array: true }];
      const query = "id=[test,case]";
      const result = getQueryParams(query, querySchema, mappers);
      expect(result).toEqual({
        id: {
          name: "id",
          type: "string",
          valid: true,
          value: ["test", "case"]
        }
      });
    });

    it("Should error if required parameter missing", () => {
      const querySchema = [{ type: "string", name: "id" }];
      const query = "id1=bob";
      const result = getQueryParams(query, querySchema, mappers);
      expect(result).toEqual({
        id: {
          name: "id",
          type: "string",
          valid: false,
          value: undefined
        }
      });
    });

    it("Should not error if optional parameter missing", () => {
      const querySchema = [{ type: "string", name: "id", optional: true }];
      const query = "id1=bob";
      const result = getQueryParams(query, querySchema, mappers);
      expect(result).toEqual({
        id: {
          name: "id",
          type: "string",
          valid: true,
          value: undefined
        }
      });
    });

    it("Should return empty array optional parameter missing", () => {
      const querySchema = [
        { type: "string", name: "id", optional: true, array: true }
      ];
      const query = "id1=bob";
      const result = getQueryParams(query, querySchema, mappers);
      expect(result).toEqual({
        id: {
          name: "id",
          type: "string",
          valid: true,
          value: []
        }
      });
    });

    it("Should return empty object if no query params defined", () => {
      const querySchema: MethodSchemaParam[] = [];
      const result: Record<string, ApiRequestParam> = getQueryParams(
        "?id=frank",
        querySchema,
        mappers
      );
      expect(result).toEqual({});
    });
  });
});
