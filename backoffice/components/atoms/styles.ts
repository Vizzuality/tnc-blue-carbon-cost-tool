import { borderWidths } from '@adminjs/design-system';

export const getInputStyle = (error?: string) => ({
  borderColor: error ? '#cc0000' : undefined,
  borderWidth: error ? '1px' : undefined,
  borderStyle: error ? 'solid' : undefined,
  color: error ? '#cc0000' : 'rgb(12, 30, 41)',
});

export const getSelectStyle = (error?: string) => ({
  control: (base: any) => ({
    ...base,
    borderColor: error ? '#cc0000' : base.borderColor,
    borderWidth: '1px',
    color: error ? '#cc0000' : 'rgb(12, 30, 41)',
  }),
});
