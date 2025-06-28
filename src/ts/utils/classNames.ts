export default function classNames(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
