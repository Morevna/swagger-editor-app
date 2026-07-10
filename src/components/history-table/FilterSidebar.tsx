import { FieldLabel, FieldContent, Field, FieldTitle } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FilterType, FilterValue } from '@/types/logs';
import { tablefilters } from '@/constants/tablefilters';
import { useTranslations } from 'next-intl';

interface FilterSidebarProps {
  onFilterChange: (type: FilterType, filter: FilterValue) => void;
}

export const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const t = useTranslations('FilterSidebar');

  return (
    <div className="flex w-1/5 flex-col gap-0 border-r px-6 py-4">
      {tablefilters.map(({ header, type, options }) => (
        <div key={header} className="border-b py-1">
          <h2 className="leading-7 font-bold">{t(header)}</h2>

          <RadioGroup
            defaultValue={options[0]}
            onValueChange={(value) => onFilterChange(type, value as FilterValue)}
            className={`
              gap-1
              ${
                header === 'methodFilterHeader'
                  ? `
                    grid grid-cols-1
                    xl:grid-cols-2
                  `
                  : `flex flex-wrap`
              }
            `}
          >
            {options.map((option) => (
              <FieldLabel
                key={option}
                htmlFor={option}
                className={`
                  w-full cursor-pointer border-none transition-all
                  hover:bg-muted/50
                  has-data-checked:bg-accent-blue/10 has-data-checked:text-accent-blue
                  has-data-checked:hover:bg-accent-blue/15
                `}
              >
                <Field orientation="horizontal" className="p-2!">
                  <FieldContent className="flex items-start">
                    <FieldTitle>{t(option)}</FieldTitle>
                  </FieldContent>

                  <RadioGroupItem value={option} id={option} className="peer sr-only" />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};
