import { unixToDate, dateToString } from ".";

describe("Utils Test Suite", () => {

    it("Should create the correct display time", () => {
        expect(dateToString(unixToDate(1622973600))).toEqual("01-05-2021, 12:00");
    });

});