import type {
  FamilyGroup,
  Person,
  RelationshipSectionData,
  SelectedPersonSummary,
} from "./types/person";
import type {
  ColorPalette,
  DashboardCard,
  SelectableOption,
} from "./types/ui";

export type PersonType = Person;
export type FamilyType = FamilyGroup;
export type SectionType = RelationshipSectionData;
export type PersonSummaryType = SelectedPersonSummary;
export type ColorsType = ColorPalette;
export type Result = DashboardCard;
export type Option = SelectableOption;

export type {
  FamilyGroup,
  Person,
  RelationshipSectionData,
  SelectedPersonSummary,
} from "./types/person";
export type {
  ColorPalette,
  DashboardCard,
  SelectableOption,
} from "./types/ui";
