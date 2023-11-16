import { cn } from '~/utils/cn.utils'

interface InputViewProps extends React.HTMLAttributes<HTMLElement> {
  text: string
}

// eslint-disable-next-line no-empty-pattern
function InputView({ text, ...props }: InputViewProps) {
  return (
    <div {...props} className={cn('m-0 h-fit w-full px-4 py-1 text-base font-semibold', props.className)}>
      {text}
    </div>
  )
}

export default InputView
