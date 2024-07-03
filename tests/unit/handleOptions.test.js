import handleOptions from "../../src/utils/handleOptions";

describe("handleOptions", () => {
  const warnSpy = jest.spyOn(console, "warn");

  it("uses defaults if no values provided", () => {
    const config = handleOptions(
      {},
      {
        maskType: {
          type: "enum",
          enums: ["person", "background"],
          default: "background",
        },
        flipHorizontal: {
          type: "boolean",
          default: false,
        },
      },
      ""
    );
    expect(config.maskType).toBe("background");
    expect(config.flipHorizontal).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  describe("ignoring properties depending on other values", () => {
    const mold = {
      runtime: {
        type: "enum",
        enums: ["mediapipe", "tfjs"],
        default: "mediapipe",
      },
      solutionPath: {
        type: "string",
        default: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
        ignore: (config) => config.runtime !== "mediapipe",
      },
    };

    it("will use the default if applicable", () => {
      const config = handleOptions(
        {
          runtime: "mediapipe",
        },
        mold,
        ""
      );
      expect(config.solutionPath).toBe(
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
      );
    });

    it("will not use the default if not applicable", () => {
      const config = handleOptions(
        {
          runtime: "tfjs",
        },
        mold,
        ""
      );
      expect(config.solutionPath).toBeUndefined();
    });

    it("will use a provided value if applicable", () => {
      const config = handleOptions(
        {
          runtime: "mediapipe",
          solutionPath: "https://example.com",
        },
        mold,
        ""
      );
      expect(config.solutionPath).toBe("https://example.com");
    });

    it("will ignore a provided value if not applicable", () => {
      const config = handleOptions(
        {
          runtime: "tfjs",
          solutionPath: "https://example.com",
        },
        mold,
        ""
      );
      expect(config.solutionPath).toBeUndefined();
      // Note: there is no warning here
    });
  });

  // helper for checking a single property value against a mold
  function checkProperty(propertyMold, providedValue, expectedReturn) {
    const config = handleOptions(
      {
        key: providedValue,
      },
      {
        key: propertyMold,
      },
      ""
    );
    expect(config.key).toBe(expectedReturn);
  }

  describe("enum handling", () => {
    const mold = {
      property: {
        type: "enum",
        enums: ["person", "background"],
        default: "background",
      },
    };

    it("is case-insensitive by default", () => {
      const config = handleOptions({ property: "Person" }, mold, "");
      expect(config.property).toBe("person");
    });

    it("falls back to the default if given an invalid value", () => {
      const config = handleOptions({ property: "invalid value" }, mold, "");
      expect(config.property).toBe("background");
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("number handling", () => {
    describe("enforcing a minimum and maximum", () => {
      const mold = {
        type: "number",
        min: 0,
        max: 1,
        default: 0.25,
      };

      it("accepts value in the range", () => {
        checkProperty(mold, 0.75, 0.75);
        checkProperty(mold, 0.5, 0.5);
      });

      it("is inclusive of the min and max", () => {
        checkProperty(mold, 0, 0);
        checkProperty(mold, 1, 1);
      });

      it("uses the default if out of range", () => {
        checkProperty(mold, -1, 0.25);
        checkProperty(mold, 2, 0.25);
        expect(warnSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe("enforcing an integer value", () => {
      const mold = {
        type: "number",
        default: 10,
        integer: true,
      };

      it("allows integers", () => {
        checkProperty(mold, 0, 0);
        checkProperty(mold, 1.0, 1);
        checkProperty(mold, 20, 20);
      });

      it("uses the default on floats", () => {
        checkProperty(mold, 0.123, 10);
        checkProperty(mold, 1.2, 10);
        expect(warnSpy).toHaveBeenCalledTimes(2);
      });
    });

    describe("enforcing multiples of a value", () => {
      const mold = {
        type: "number",
        multipleOf: 32,
        default: 256,
      };

      it("allows multiples", () => {
        checkProperty(mold, 0, 0);
        checkProperty(mold, 32, 32);
        checkProperty(mold, 64, 64);
      });

      it("uses the default if not a multiple", () => {
        checkProperty(mold, 10, 256);
        expect(warnSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("alias handling", () => {
    const mold = {
      property: {
        type: "number",
        default: 0,
        alias: "aliasProperty",
      },
    };

    it("uses the alias if provided", () => {
      const config = handleOptions(
        {
          aliasProperty: 10,
        },
        mold,
        ""
      );
      expect(config.property).toBe(10);
    });

    it("uses the original key if both original and alias are provided", () => {
      const config = handleOptions(
        {
          aliasProperty: 10,
          property: 20,
        },
        mold,
        ""
      );
      expect(config.property).toBe(20);
    });
  });
});
