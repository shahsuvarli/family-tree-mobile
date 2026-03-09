import {
  buildPersonPayload,
  createPersonFormDefaults,
  type PersonFormValues,
} from "@/features/people/lib/person-form";

describe("person form helpers", () => {
  it("creates stable default values", () => {
    const date = new Date(2026, 2, 9);

    expect(createPersonFormDefaults(date)).toEqual({
      name: "",
      surname: "",
      birthDate: "09 Mar 2026",
      gender: 1,
      maritalStatus: 1,
      life: 1,
      notes: "",
    });
  });

  it("builds a trimmed payload for create and edit mutations", () => {
    const values: PersonFormValues = {
      name: "  Ada  ",
      surname: "  Lovelace ",
      birthDate: "10 Dec 1815",
      gender: 2,
      maritalStatus: 2,
      life: 2,
      notes: "  important note  ",
    };
    const birthDate = new Date(1815, 11, 10);

    expect(buildPersonPayload(values, birthDate, "profile-123")).toEqual({
      name: "Ada",
      surname: "Lovelace",
      birth_date: birthDate,
      gender: 2,
      life: 2,
      marital_status: 2,
      notes: "important note",
      profile_id: "profile-123",
    });
  });

  it("normalizes missing date and profile values to null", () => {
    const values: PersonFormValues = {
      name: "Grace",
      surname: "Hopper",
      birthDate: "",
      gender: 1,
      maritalStatus: 1,
      life: 1,
      notes: "",
    };

    expect(buildPersonPayload(values, undefined, undefined)).toEqual({
      name: "Grace",
      surname: "Hopper",
      birth_date: null,
      gender: 1,
      life: 1,
      marital_status: 1,
      notes: "",
      profile_id: null,
    });
  });
});
