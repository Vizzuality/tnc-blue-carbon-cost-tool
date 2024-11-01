import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO: Ingest this data from the excel file
//       For testing purposes, I am querying this to have some data:

// INSERT INTO assumptions (assumption_name, units, value) VALUES
// ('Verification frequency', 'yrs', '5'),
//     ('Baseline reassessment frequency', 'yrs', '10'),
//     ('Annual cost increase', '%/yr', '0%'),
//     ('Discount rate', '%', '4%'),
//     ('Mangrove restoration rate', 'ha/yr', '250'),
//     ('Seagrass restoration rate', 'ha/yr', '250'),
//     ('Salt marsh restoration rate', 'ha/yr', '250'),
//     ('Carbon price', '$/tCO2e', '$30'),
//     ('Carbon price increase', '%/yr', '2%'),
//     ('Buffer', '%', '20%'),
//     ('Site specific ecosystem loss rate (if national no national loss rate)', '%', '-0.24%'),
//     ('Interest rate', '%', '5%'),
//     ('Loan repayment schedule', 'yrs', '10'),
//     ('Conservation project length', 'yrs', '20'),
//     ('Restoration project length', 'yrs', '20'),
//     ('Soil Organic carbon release length', 'yrs', '10'),
//     ('Recruitment/ Expansion scenario', NULL, 'High recruitment/ expansion'),
//     ('Planting success rate', '%', '80%');
@Entity("assumptions")
export class Assumption extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "assumption_name", type: "varchar", length: 100 })
  assumptionName: string;

  @Column({ name: "unit", type: "varchar", length: 20, nullable: true })
  units: string;

  @Column({ name: "value", type: "varchar", length: 50 })
  value: string;
}
