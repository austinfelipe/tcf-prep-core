/**
 * Complete answer lookup for all A1 verbs.
 * Keys: "${infinitive}|${tenseDisplay}|${pronounDisplay}" → first accepted answer
 */

const TENSE_DISPLAY: Record<string, string> = {
  présent: 'Présent',
  futur_proche: 'Futur proche',
  passé_composé: 'Passé composé',
};

const PRONOUN_DISPLAY: Record<string, string> = {
  je: 'je',
  tu: 'tu',
  il: 'il/elle/on',
  nous: 'nous',
  vous: 'vous',
  ils: 'ils/elles',
};

// Raw A1 conjugation data: infinitive → tenseKey → pronounKey → first accepted answer
const A1_DATA: Record<string, Record<string, Record<string, string>>> = {
  'être': {
    présent: { je: 'je suis', tu: 'tu es', il: 'il est', nous: 'nous sommes', vous: 'vous êtes', ils: 'ils sont' },
    futur_proche: { je: 'je vais être', tu: 'tu vas être', il: 'il va être', nous: 'nous allons être', vous: 'vous allez être', ils: 'ils vont être' },
    passé_composé: { je: "j'ai été", tu: 'tu as été', il: 'il a été', nous: 'nous avons été', vous: 'vous avez été', ils: 'ils ont été' },
  },
  'avoir': {
    présent: { je: "j'ai", tu: 'tu as', il: 'il a', nous: 'nous avons', vous: 'vous avez', ils: 'ils ont' },
    futur_proche: { je: 'je vais avoir', tu: 'tu vas avoir', il: 'il va avoir', nous: 'nous allons avoir', vous: 'vous allez avoir', ils: 'ils vont avoir' },
    passé_composé: { je: "j'ai eu", tu: 'tu as eu', il: 'il a eu', nous: 'nous avons eu', vous: 'vous avez eu', ils: 'ils ont eu' },
  },
  'faire': {
    présent: { je: 'je fais', tu: 'tu fais', il: 'il fait', nous: 'nous faisons', vous: 'vous faites', ils: 'ils font' },
    futur_proche: { je: 'je vais faire', tu: 'tu vas faire', il: 'il va faire', nous: 'nous allons faire', vous: 'vous allez faire', ils: 'ils vont faire' },
    passé_composé: { je: "j'ai fait", tu: 'tu as fait', il: 'il a fait', nous: 'nous avons fait', vous: 'vous avez fait', ils: 'ils ont fait' },
  },
  'aller': {
    présent: { je: 'je vais', tu: 'tu vas', il: 'il va', nous: 'nous allons', vous: 'vous allez', ils: 'ils vont' },
    futur_proche: { je: 'je vais aller', tu: 'tu vas aller', il: 'il va aller', nous: 'nous allons aller', vous: 'vous allez aller', ils: 'ils vont aller' },
    passé_composé: { je: 'je suis allé', tu: 'tu es allé', il: 'il est allé', nous: 'nous sommes allés', vous: 'vous êtes allé', ils: 'ils sont allés' },
  },
  'pouvoir': {
    présent: { je: 'je peux', tu: 'tu peux', il: 'il peut', nous: 'nous pouvons', vous: 'vous pouvez', ils: 'ils peuvent' },
    futur_proche: { je: 'je vais pouvoir', tu: 'tu vas pouvoir', il: 'il va pouvoir', nous: 'nous allons pouvoir', vous: 'vous allez pouvoir', ils: 'ils vont pouvoir' },
    passé_composé: { je: "j'ai pu", tu: 'tu as pu', il: 'il a pu', nous: 'nous avons pu', vous: 'vous avez pu', ils: 'ils ont pu' },
  },
  'vouloir': {
    présent: { je: 'je veux', tu: 'tu veux', il: 'il veut', nous: 'nous voulons', vous: 'vous voulez', ils: 'ils veulent' },
    futur_proche: { je: 'je vais vouloir', tu: 'tu vas vouloir', il: 'il va vouloir', nous: 'nous allons vouloir', vous: 'vous allez vouloir', ils: 'ils vont vouloir' },
    passé_composé: { je: "j'ai voulu", tu: 'tu as voulu', il: 'il a voulu', nous: 'nous avons voulu', vous: 'vous avez voulu', ils: 'ils ont voulu' },
  },
  'devoir': {
    présent: { je: 'je dois', tu: 'tu dois', il: 'il doit', nous: 'nous devons', vous: 'vous devez', ils: 'ils doivent' },
    futur_proche: { je: 'je vais devoir', tu: 'tu vas devoir', il: 'il va devoir', nous: 'nous allons devoir', vous: 'vous allez devoir', ils: 'ils vont devoir' },
    passé_composé: { je: "j'ai dû", tu: 'tu as dû', il: 'il a dû', nous: 'nous avons dû', vous: 'vous avez dû', ils: 'ils ont dû' },
  },
  'savoir': {
    présent: { je: 'je sais', tu: 'tu sais', il: 'il sait', nous: 'nous savons', vous: 'vous savez', ils: 'ils savent' },
    futur_proche: { je: 'je vais savoir', tu: 'tu vas savoir', il: 'il va savoir', nous: 'nous allons savoir', vous: 'vous allez savoir', ils: 'ils vont savoir' },
    passé_composé: { je: "j'ai su", tu: 'tu as su', il: 'il a su', nous: 'nous avons su', vous: 'vous avez su', ils: 'ils ont su' },
  },
  'dire': {
    présent: { je: 'je dis', tu: 'tu dis', il: 'il dit', nous: 'nous disons', vous: 'vous dites', ils: 'ils disent' },
    futur_proche: { je: 'je vais dire', tu: 'tu vas dire', il: 'il va dire', nous: 'nous allons dire', vous: 'vous allez dire', ils: 'ils vont dire' },
    passé_composé: { je: "j'ai dit", tu: 'tu as dit', il: 'il a dit', nous: 'nous avons dit', vous: 'vous avez dit', ils: 'ils ont dit' },
  },
  'venir': {
    présent: { je: 'je viens', tu: 'tu viens', il: 'il vient', nous: 'nous venons', vous: 'vous venez', ils: 'ils viennent' },
    futur_proche: { je: 'je vais venir', tu: 'tu vas venir', il: 'il va venir', nous: 'nous allons venir', vous: 'vous allez venir', ils: 'ils vont venir' },
    passé_composé: { je: 'je suis venu', tu: 'tu es venu', il: 'il est venu', nous: 'nous sommes venus', vous: 'vous êtes venu', ils: 'ils sont venus' },
  },
  'prendre': {
    présent: { je: 'je prends', tu: 'tu prends', il: 'il prend', nous: 'nous prenons', vous: 'vous prenez', ils: 'ils prennent' },
    futur_proche: { je: 'je vais prendre', tu: 'tu vas prendre', il: 'il va prendre', nous: 'nous allons prendre', vous: 'vous allez prendre', ils: 'ils vont prendre' },
    passé_composé: { je: "j'ai pris", tu: 'tu as pris', il: 'il a pris', nous: 'nous avons pris', vous: 'vous avez pris', ils: 'ils ont pris' },
  },
  'mettre': {
    présent: { je: 'je mets', tu: 'tu mets', il: 'il met', nous: 'nous mettons', vous: 'vous mettez', ils: 'ils mettent' },
    futur_proche: { je: 'je vais mettre', tu: 'tu vas mettre', il: 'il va mettre', nous: 'nous allons mettre', vous: 'vous allez mettre', ils: 'ils vont mettre' },
    passé_composé: { je: "j'ai mis", tu: 'tu as mis', il: 'il a mis', nous: 'nous avons mis', vous: 'vous avez mis', ils: 'ils ont mis' },
  },
  'voir': {
    présent: { je: 'je vois', tu: 'tu vois', il: 'il voit', nous: 'nous voyons', vous: 'vous voyez', ils: 'ils voient' },
    futur_proche: { je: 'je vais voir', tu: 'tu vas voir', il: 'il va voir', nous: 'nous allons voir', vous: 'vous allez voir', ils: 'ils vont voir' },
    passé_composé: { je: "j'ai vu", tu: 'tu as vu', il: 'il a vu', nous: 'nous avons vu', vous: 'vous avez vu', ils: 'ils ont vu' },
  },
  'parler': {
    présent: { je: 'je parle', tu: 'tu parles', il: 'il parle', nous: 'nous parlons', vous: 'vous parlez', ils: 'ils parlent' },
    futur_proche: { je: 'je vais parler', tu: 'tu vas parler', il: 'il va parler', nous: 'nous allons parler', vous: 'vous allez parler', ils: 'ils vont parler' },
    passé_composé: { je: "j'ai parlé", tu: 'tu as parlé', il: 'il a parlé', nous: 'nous avons parlé', vous: 'vous avez parlé', ils: 'ils ont parlé' },
  },
  'manger': {
    présent: { je: 'je mange', tu: 'tu manges', il: 'il mange', nous: 'nous mangeons', vous: 'vous mangez', ils: 'ils mangent' },
    futur_proche: { je: 'je vais manger', tu: 'tu vas manger', il: 'il va manger', nous: 'nous allons manger', vous: 'vous allez manger', ils: 'ils vont manger' },
    passé_composé: { je: "j'ai mangé", tu: 'tu as mangé', il: 'il a mangé', nous: 'nous avons mangé', vous: 'vous avez mangé', ils: 'ils ont mangé' },
  },
};

// Build the lookup map
const answerMap: Record<string, string> = {};
for (const [infinitive, tenses] of Object.entries(A1_DATA)) {
  for (const [tenseKey, pronouns] of Object.entries(tenses)) {
    const tenseDisplay = TENSE_DISPLAY[tenseKey];
    for (const [pronounKey, answer] of Object.entries(pronouns)) {
      const pronounDisplay = PRONOUN_DISPLAY[pronounKey];
      answerMap[`${infinitive}|${tenseDisplay}|${pronounDisplay}`] = answer;
    }
  }
}

export function lookupAnswer(
  infinitive: string,
  tenseDisplay: string,
  pronounDisplay: string,
): string {
  const key = `${infinitive}|${tenseDisplay}|${pronounDisplay}`;
  const answer = answerMap[key];
  if (!answer) {
    throw new Error(`No answer found for: ${key}`);
  }
  return answer;
}
