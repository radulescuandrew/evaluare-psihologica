import { FormDef, QuestionDef, ScaleOption } from "@/domain/forms";

const scale4Freq: ScaleOption[] = [
  { value: 1, label: "Rareori" },
  { value: 2, label: "Uneori" },
  { value: 3, label: "Adesea" },
  { value: 4, label: "Totdeauna" },
];

const scale4Intensity: ScaleOption[] = [
  { value: 1, label: "Deloc" },
  { value: 2, label: "Puțin" },
  { value: 3, label: "Destul" },
  { value: 4, label: "Foarte mult" },
];

const scale4Trait: ScaleOption[] = [
  { value: 1, label: "Aproape niciodată" },
  { value: 2, label: "Câteodată" },
  { value: 3, label: "Adeseori" },
  { value: 4, label: "Aproape totdeauna" },
];

const depressionPrompts = [
  "Mă simt abătut și trist",
  "Dimineața mă simt mai bine",
  "Plâng sau mă simt ca plângând",
  "Dorm rău",
  "Mănânc tot atât de mult ca înainte",
  "Mă bucur privind/vorbind fiind în compania unei persoane atractive",
  "Am slăbit",
  "Sunt constipat",
  "Inima mea bate mai repede ca de obicei",
  "Mă simt obosit fără motiv",
  "Mintea mea este tot atât de limpede ca de obicei",
  "Găsesc că este ușor să fac lucrurile ca de obicei",
  "Sunt agitat și nu pot sta liniștit",
  "Am încredere în viitor",
  "Sunt mai iritabil decât de obicei",
  "Este ușor să hotărăști",
  "Am sentimentul că sunt util și necesar",
  "Viața mea este suficient de împlinită",
  "Am sentimentul că ar fi mai bine să fi fost mort",
  "Mă bucur de lucruri ca mai înainte",
];

const depressionReversed = new Set([2, 5, 6, 11, 12, 14, 16, 17, 18, 20]);

const staiX1Prompts = [
  "Mă simt calm(ă)", "Mă simt liniștit(ă)", "Sunt încordat(ă)", "Îmi pare rău de ceva", "Mă simt în apele mele",
  "Sunt trist(ă)", "Mă îngrijorează niște neplăceri posibile", "Mă simt odihnit(ă)", "Mă simt neliniștit(ă)", "Mă simt bine",
  "Am încredere în puterile mele", "Mă simt nervos(oasă)", "Sunt speriat(ă)", "Mă simt iritat(ă)", "Sunt relaxat(ă)",
  "Mă simt mulțumit(ă)", "Sunt îngrijorat(ă)", "Mă simt agitat și scos din fire", "Mă simt vesel(ă)", "Sunt bine dispus(ă)"
];

const staiX1Reversed = new Set([1, 2, 5, 8, 10, 11, 15, 16, 19, 20]);

const staiX2Prompts = [
  "Sunt bine dispus", "Obosesc repede", "Îmi vine să plâng", "Aș dori să fiu la fel de fericit(ă) ca alții",
  "Îmi scapă unele lucruri pentru că nu mă decid repede", "Mă simt odihnit(ă)", "Sunt calm și concentrat",
  "Simt că se adună greutățile și nu le mai pot face față",
  "Mă frământă prea mult anumite lucruri fără importanță", "Sunt fericit(ă)",
  "Sunt înclinat(ă) să iau lucrurile prea în serios", "Îmi lipsește încrederea în puterile mele", "Mă simt în siguranță",
  "Încerc să evit un moment critic sau o dificultate", "Mă simt abătut(ă)", "Mă simt mulțumit(ă)",
  "Îmi trece prin minte câte un gând lipsit de importanță și mă sâcâie",
  "Pun la suflet dezamăgirile", "Sunt un om echilibrat",
  "Când mă gândesc la necazurile mele prezente, devin nervos și prost dispus"
];

const staiX2Reversed = new Set([1, 6, 7, 10, 13, 16, 19]);

const mapPrompts = (
  prompts: string[],
  sectionId: string,
  options: ScaleOption[],
  reversed: Set<number> = new Set(),
): QuestionDef[] =>
  prompts.map((prompt, idx) => ({
    id: `f2_${sectionId}_${idx + 1}`,
    formId: "form2",
    sectionId,
    prompt,
    type: reversed.has(idx + 1) ? "likert_reverse_keyed" : "likert_uniform",
    required: true,
    options,
    reverseScoring: reversed.has(idx + 1),
  }));

export const form2Def: FormDef = {
  id: "form2",
  title: "Formular 2",
  sections: [
    {
      id: "depr",
      title: "Scala depresie (20 itemi)",
      intro: [
        "Citiți fiecare afirmație și alegeți varianta care descrie cel mai bine cum v-ați simțit în ultima perioadă.",
      ],
      answerDisplay: "number_only",
      legend: [
        "1 = rareori",
        "2 = uneori",
        "3 = adesea",
        "4 = totdeauna",
      ],
    },
    {
      id: "x1",
      title: "STAI Forma X1 - anxietatea ca stare",
      intro: [
        "Instrucțiuni: Mai jos sunt date diferite descrieri ale unor stări sufletești.",
        "Citiți fiecare descriere în parte și încercuiți acea cifră din dreapta descrierii care corespunde cu felul cum vă simțiți acum, în acest moment.",
        "Nu există răspunsuri bune sau rele.",
      ],
      answerDisplay: "number_only",
      legend: [
        "1 = deloc",
        "2 = puțin",
        "3 = destul",
        "4 = foarte mult",
      ],
    },
    {
      id: "x2",
      title: "STAI Forma X2 - anxietatea ca trăsătură",
      intro: [
        "Instrucțiuni: Mai jos sunt date diferite descrieri ale unor stări sufletești.",
        "Citiți fiecare descriere în parte și încercuiți acea cifră din dreapta descrierii care corespunde cu felul cum vă simțiți de obicei.",
        "Nu există răspunsuri bune sau rele.",
      ],
      answerDisplay: "number_only",
      legend: [
        "1 = aproape niciodată",
        "2 = câteodată",
        "3 = adeseori",
        "4 = aproape totdeauna",
      ],
    },
  ],
  questions: [
    ...mapPrompts(depressionPrompts, "depr", scale4Freq, depressionReversed),
    ...mapPrompts(staiX1Prompts, "x1", scale4Intensity, staiX1Reversed),
    ...mapPrompts(staiX2Prompts, "x2", scale4Trait, staiX2Reversed),
  ],
};
