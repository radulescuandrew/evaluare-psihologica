import { FormDef, QuestionDef } from "@/domain/forms";

type BdiOpt = string | { label: string; value: number; id?: string };

const mk = (idx: number, prompt: string, options: BdiOpt[]): QuestionDef => ({
  id: `f3_bdi_${idx}`,
  formId: "form3",
  sectionId: "bdi2",
  prompt,
  type: "mcq_grouped",
  required: true,
  options: options.map((item, value) =>
    typeof item === "string"
      ? { value, label: item }
      : { value: item.value, label: item.label, id: item.id },
  ),
  groupId: `bdi_group_${idx}`,
});

const items: QuestionDef[] = [
  mk(1, "Tristețe", ["Nu mă simt trist(ă).", "Mă simt trist(ă) în cea mai mare parte a timpului.", "Sunt trist(ă) tot timpul.", "Sunt atât de trist(ă) sau nefericit(ă) că nu mai suport."]),
  mk(2, "Pesimism", ["Nu sunt descurajat(ă) în ceea ce privește viitorul.", "Sunt mai descurajat(ă) decât înainte.", "Nu mă aștept ca lucrurile să meargă bine.", "Viitorul meu este fără speranță." ]),
  mk(3, "Eșecuri trecute", ["Nu mă simt un(o) ratat(ă).", "Am avut mai multe eșecuri decât ar fi fost cazul.", "Când mă uit în urmă văd numeroase eșecuri.", "Mă simt complet ratat(ă)."]),
  mk(4, "Pierderea plăcerii", ["Îmi face plăcere ca înainte.", "Nu mă mai mulțumesc lucrurile ca înainte.", "Obțin prea puțină plăcere din ce făceam.", "Nu mai am deloc plăcere."]),
  mk(5, "Sentimente de vinovăție", ["Nu mă simt vinovat(ă).", "Mă simt vinovat(ă) pentru multe lucruri.", "Mă simt vinovat(ă) în cea mai mare parte a timpului.", "Mă simt vinovat(ă) de tot timpul."]),
  mk(6, "Sentimentul de a fi pedepsit", ["Nu cred că voi fi pedepsit(ă).", "Cred că este posibil să fiu pedepsit(ă).", "Mă aștept să fiu pedepsit(ă).", "Simt că sunt pedepsit(ă)."]),
  mk(7, "Nemulțumire față de propria persoană", ["Părerea mea nu s-a schimbat.", "Mi-am pierdut încrederea în mine.", "Sunt dezamăgit(ă) de mine.", "Îmi displac de mine."]),
  mk(8, "Autocritica", ["Nu mă critic mai mult decât obișnuit.", "Mă critic mai mult decât de obicei.", "Mă critic pentru toate greșelile.", "Mă învinovățesc pentru toate relele care se întâmplă."]),
  mk(9, "Gânduri sau dorințe suicidare", ["Nu mă gândesc să îmi iau viața.", "Mă gândesc, dar nu aș face asta.", "Intenționez să îmi pun capăt zilelor.", "Mi-aș lua viața dacă aș avea ocazia."]),
  mk(10, "Plâns", ["Nu plâng mai mult decât de obicei.", "Plâng mai mult decât de obicei.", "Plâng pentru orice lucru mărunt.", "Îmi vine să plâng, dar nu mai pot plânge."]),
  mk(11, "Agitație", ["Nu sunt mai agitat(ă) decât de obicei.", "Sunt mai agitat(ă) decât de obicei.", "Sunt atât de agitat(ă) încât nu pot sta liniștit(ă).", "Sunt atât de agitat(ă) încât trebuie să mă mișc sau să fac ceva."]),
  mk(12, "Pierderea interesului", ["Nu mi-am pierdut interesul față de oameni/activități.", "Mi-a scăzut interesul față de oameni/activități.", "Mi-am pierdut mare parte din interes.", "Aproape nimic nu mă mai interesează."]),
  mk(13, "Indecizie", ["Iau decizii la fel de ușor ca altădată.", "Mi-e mai greu să iau decizii.", "Mi-e mult mai greu să iau decizii.", "Mi-e greu să iau orice decizie."]),
  mk(14, "Lipsa valorii personale", ["Nu cred că sunt lipsit(ă) de valoare.", "Mă consider mai puțin valoros(oasă).", "Mă simt mult mai puțin valoros(oasă).", "Cred că sunt complet lipsit(ă) de valoare."]),
  mk(15, "Lipsa energiei", ["Am la fel de multă energie ca altădată.", "Am mai puțină energie decât de obicei.", "Nu prea am energie să fac lucruri.", "Nu mai am energie pentru nimic."]),
  mk(16, "Modificări ale somnului", [
    { id: "16_0", value: 0, label: "Dorm la fel ca altădată." },
    { id: "16_1a", value: 1, label: "Dorm ceva mai mult decât de obicei." },
    { id: "16_1b", value: 1, label: "Dorm ceva mai puțin decât de obicei." },
    { id: "16_2a", value: 2, label: "Dorm mult mai mult decât de obicei." },
    { id: "16_2b", value: 2, label: "Dorm mult mai puțin decât de obicei." },
    { id: "16_3a", value: 3, label: "Dorm cea mai mare parte a zilei." },
    { id: "16_3b", value: 3, label: "Mă trezesc cu 1-2 ore mai repede decât ar fi cazul și nu pot readormi." },
  ]),
  mk(17, "Iritabilitate", ["Nu sunt mai iritabil(ă) decât de obicei.", "Sunt mai iritabil(ă) decât de obicei.", "Sunt mult mai iritabil(ă) decât de obicei.", "Sunt iritabil(ă) tot timpul."]),
  mk(18, "Modificări ale poftei de mâncare", [
    { id: "18_0", value: 0, label: "Nu am observat nicio schimbare în pofta mea de mâncare." },
    { id: "18_1a", value: 1, label: "Am mai puțină poftă de mâncare decât de obicei." },
    { id: "18_1b", value: 1, label: "Am mai multă poftă de mâncare decât de obicei." },
    { id: "18_2a", value: 2, label: "Am mult mai puțină poftă de mâncare decât de obicei." },
    { id: "18_2b", value: 2, label: "Am mult mai multă poftă de mâncare decât de obicei." },
    { id: "18_3a", value: 3, label: "Nu am deloc poftă de mâncare." },
    { id: "18_3b", value: 3, label: "Tânjesc după mâncare tot timpul." },
  ]),
  mk(19, "Dificultăți de concentrare", ["Mă concentrez la fel de bine ca altădată.", "Nu mă pot concentra la fel de bine.", "Îmi e greu să mă concentrez mult timp.", "Nu mă pot concentra la nimic."]),
  mk(20, "Oboseală sau fatigabilitate", ["Nu sunt mai obosit(ă) decât de obicei.", "Obosesc mai repede decât de obicei.", "Sunt prea obosit(ă) pentru multe lucruri.", "Sunt prea obosit(ă) pentru majoritatea lucrurilor."]),
  mk(21, "Pierderea interesului pentru sex", ["Nu am observat modificări.", "Sexul mă interesează mai puțin decât de obicei.", "Sexul mă interesează mult mai puțin acum.", "Sexul nu mă mai interesează deloc."]),
];

export const form3Def: FormDef = {
  id: "form3",
  title: "Formular 3 - BDI-II",
  sections: [
    {
      id: "bdi2",
      title: "BDI-II",
      intro: [
        "Instrucțiuni: Următorul chestionar cuprinde 21 de grupuri afirmații.",
        "Vă rugăm citiți cu atenție fiecare grup de afirmații și alegeți acea afirmație care descrie cel mai bine felul în care v-ați simțit în ultimele două săptămâni, inclusiv astăzi.",
        "Încercuiți numărul din dreptul afirmației alese.",
      ],
      legend: [
        "Alegeți o singură afirmație (0-3) din fiecare grup.",
        "Scor mai mare = intensitate mai mare a simptomului.",
      ],
    },
  ],
  questions: items,
};
