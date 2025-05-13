import { SequestrationRateCalculator } from '@api/modules/calculations/calculators/sequestration-rate.calculator';
import { restorationProjectInputMock } from './fixtures';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';

describe('Restoration Plan - Unit Tests', () => {
  describe('Default restoration plan', () => {
    const input = structuredClone(restorationProjectInputMock);
    const sequestrationRateCalculator = new SequestrationRateCalculator(input);
    test('It should create a default restoration plan with the length of the project, and the default restoration rate in hectares', () => {
      const projectSizeHa = 10000;
      const restorationRate = 250;
      const projectLength = 20;

      const defaultRestorationPlan =
        sequestrationRateCalculator.initializeRestorationPlan(
          projectSizeHa,
          restorationRate,
          projectLength,
        );

      // Since the cumulative restoration plan does not exceed the project size, the default restoration plan is extended across all years of the project length
      expect(defaultRestorationPlan).toEqual({
        '1': 250,
        '2': 250,
        '3': 250,
        '4': 250,
        '5': 250,
        '6': 250,
        '7': 250,
        '8': 250,
        '9': 250,
        '10': 250,
        '11': 250,
        '12': 250,
        '13': 250,
        '14': 250,
        '15': 250,
        '16': 250,
        '17': 250,
        '18': 250,
        '19': 250,
        '20': 250,
        '-1': 250,
      });
    });
    test('It should create a default restoration plan with expected restored hectares reach the project size, leaving the rest of the years empty', () => {
      const projectSizeHa = 2130;
      const restorationRate = 250;
      const projectLength = 10;

      const defaultRestorationPlan =
        sequestrationRateCalculator.initializeRestorationPlan(
          projectSizeHa,
          restorationRate,
          projectLength,
        );

      // Once the cumulative restoration plan reaches the project size, the rest of the years are left empty
      expect(defaultRestorationPlan).toEqual({
        '1': 250,
        '2': 250,
        '3': 250,
        '4': 250,
        '5': 250,
        '6': 250,
        '7': 250,
        '8': 130,
        '9': 0,
        '10': 0,
        '-1': 250,
      });
    });
  });
  describe('Update restoration plan', () => {
    const input = structuredClone(restorationProjectInputMock);
    const sequestrationRateCalculator = new SequestrationRateCalculator(input);
    test('If the custom restoration plan is empty, it should return the default restoration plan', () => {
      const mockInput = {
        customRestorationPlan: {},
      } as unknown as RestorationProjectInput;
      const projectSizeHa = 50;
      const restorationRate = 10;
      const projectLength = 5;
      const defaultRestorationPlan =
        sequestrationRateCalculator.initializeRestorationPlan(
          projectSizeHa,
          restorationRate,
          projectLength,
        );
      sequestrationRateCalculator.restorationPlan = defaultRestorationPlan;
      const modifiedRestorationPlan =
        sequestrationRateCalculator.updateRestorationPlan(mockInput);

      expect(modifiedRestorationPlan).toEqual(defaultRestorationPlan);
    });
    test('If the custom restoration plan is missing years for the total of the project length, the missing years should be filled with the restoration plan until reaching the project size', () => {
      const customRestorationPlan = { 1: 20, 14: 17, 17: 87 };
      const input = {
        customRestorationPlan,
      } as unknown as RestorationProjectInput;
      const projectSizeHa = 1000;
      const restorationRate = 250;
      const projectLength = 20;
      sequestrationRateCalculator.restorationPlan =
        sequestrationRateCalculator.initializeRestorationPlan(
          projectSizeHa,
          restorationRate,
          projectLength,
        );
      const modifiedRestorationPlan =
        sequestrationRateCalculator.updateRestorationPlan(input);

      expect(modifiedRestorationPlan).toEqual({
        '1': 20,
        '2': 250,
        '3': 250,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0,
        '12': 0,
        '13': 0,
        '14': 17,
        '15': 0,
        '16': 0,
        '17': 87,
        '18': 0,
        '19': 0,
        '20': 0,
        '-1': 250,
      });
    });
    test('It should update the restoration plan with the custom plan, adding the -1 year with the current restoration rate', () => {
      const input = structuredClone(restorationProjectInputMock);

      const customRestorationPlan = {
        '1': 200,
        '2': 200,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        '11': 0,
        '12': 0,
        '13': 0,
        '14': 0,
        '15': 0,
        '16': 0,
        '17': 0,
        '18': 0,
        '19': 0,
        '20': 0,
      };

      input.customRestorationPlan = customRestorationPlan;

      const calculator = new SequestrationRateCalculator(input);

      calculator.restorationPlan = calculator.initializeRestorationPlan(
        input.projectSizeHa,
        input.assumptions.restorationRate,
        input.assumptions.projectLength,
      );

      const result = calculator.updateRestorationPlan(input);

      expect(result).toEqual({
        ...customRestorationPlan,
        '-1': input.assumptions.restorationRate,
      });
    });
  });
});
