import { FieldLabel, FieldContent, Field, FieldTitle } from '@/components/ui/Field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { DateFilter } from '@/types/logs';
import { useTranslations } from 'next-intl';

interface DateFilterSidebarProps {
  onFilterChange: (filter: DateFilter) => void;
}

export const DateFilterSidebar = ({ onFilterChange }: DateFilterSidebarProps) => {
  const t = useTranslations('HistoryPage');

  const dateFilterOptions: Array<{ value: DateFilter; label: string }> = [
    { value: 'all', label: t('all') },
    { value: 'today', label: t('today') },
    { value: 'yesterday', label: t('yesterday') },
    { value: 'lastWeek', label: t('lastWeek') },
    { value: 'lastMonth', label: t('lastMonth') },
  ];

  return (
    <div className="flex w-1/5 flex-col gap-6 border-r px-6 py-4">
      <h2 className="leading-8 font-bold">{t('dataFilter')}</h2>

      <RadioGroup
        defaultValue={'all'}
        onValueChange={(value) => onFilterChange(value as DateFilter)}
        className="flex flex-col gap-2"
      >
        {dateFilterOptions.map((option) => (
          <FieldLabel
            key={option.value}
            htmlFor={option.value}
            className="
              w-full cursor-pointer border-none transition-all
              hover:bg-muted/50
              has-data-checked:bg-accent-blue/10 has-data-checked:text-accent-blue
              has-data-checked:hover:bg-accent-blue/15
            "
          >
            <Field orientation="horizontal">
              <FieldContent className="flex items-start">
                <FieldTitle>{option.label}</FieldTitle>
              </FieldContent>

              <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  );
};
