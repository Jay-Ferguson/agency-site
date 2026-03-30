import { format, isValid, parseISO } from 'date-fns'

export default function Date({ dateString }: { dateString: string }) {
  if (!isValid(parseISO(dateString))) {
    return 'No date';
  }
  const date = parseISO(dateString);
  // Format as ISO 8601 string (YYYY-MM-DD)
  const isoString = date.toISOString();
  return(
       <time dateTime={isoString}>{format(date,'LLLL d, yyyy')}
       {isoString}
       </time>
  )
}