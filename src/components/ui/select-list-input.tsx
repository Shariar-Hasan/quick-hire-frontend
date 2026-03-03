import { MultiSelectFilterProps, SelectFilterProps } from '@/types/table-types'
import MultiSelect from './multiselect'

const SelectListInput = (props: SelectFilterProps | MultiSelectFilterProps) => {
    return (
        <MultiSelect
            options={props.options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)}
            value={props.type === 'select' ? (props.value ? [props.value] : []) : (props.value || [])}
            onValueChange={(vals) => {
                if (props.type === 'select') {
                    props.onChange(vals?.[0] || '');
                } else {
                    props.onChange(vals);
                }
            }}
            disabled={props.disabled}
            label={props.label}
            placeholder={props.placeholder || 'Select...'}
            maxView={(props as MultiSelectFilterProps)?.maxView || 2}
            single={props.type === 'select'}
            searchable={props.searchable}
            hideCheckbox={props.hideCheckbox}
            onClear={props.onClear}
            clearable={props.clearable}
        />
    )
}

export default SelectListInput