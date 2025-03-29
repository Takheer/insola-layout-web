export const pluralize = (num: number, one: string, few: string, many: string) => {
  const ruCardinalRules = new Intl.PluralRules("ru-RU");
  switch (ruCardinalRules.select(num)) {
    case 'one': {
      return one;
    }
    case "few": {
      return few
    }
    case "many": {
      return many
    }
  }
}