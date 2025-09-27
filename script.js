// Drug classifications and medications based on med_categories.txt
// Rainbow color scheme: Red, Orange, Yellow, Green, Blue, Indigo, Violet, Pink
const drugData = {
    'Antidepressants': {
        defaultColor: 'rgba(255, 59, 48, 0.2)',   // Red
        activeColor: 'rgba(255, 59, 48, 0.8)',
        drugs: ['Fluoxetine', 'Sertraline', 'Escitalopram', 'Venlafaxine', 'Duloxetine', 'Amitriptyline', 'Nortriptyline', 'Phenelzine', 'Tranylcypromine', 'Bupropion', 'Mirtazapine', 'Trazodone', 'Vortioxetine', 'Vilazodone']
    },
    'Antipsychotics': {
        defaultColor: 'rgba(255, 149, 0, 0.2)',   // Orange
        activeColor: 'rgba(255, 149, 0, 0.8)',
        drugs: ['Haloperidol', 'Chlorpromazine', 'Risperidone', 'Olanzapine', 'Clozapine', 'Quetiapine', 'Aripiprazole', 'Ziprasidone']
    },
    'Mood Stabilizers': {
        defaultColor: 'rgba(255, 204, 0, 0.2)',   // Yellow
        activeColor: 'rgba(255, 204, 0, 0.8)',
        drugs: ['Lithium']
    },
    'Anxiolytics & Sedatives': {
        defaultColor: 'rgba(52, 199, 89, 0.2)',   // Green
        activeColor: 'rgba(52, 199, 89, 0.8)',
        drugs: ['Lorazepam', 'Diazepam', 'Alprazolam', 'Clonazepam', 'Zolpidem', 'Eszopiclone', 'Buspirone', 'Hydroxyzine', 'Propranolol']
    },
    'Stimulants / ADHD': {
        defaultColor: 'rgba(0, 122, 255, 0.2)',   // Blue
        activeColor: 'rgba(0, 122, 255, 0.8)',
        drugs: ['Dextroamphetamine', 'Lisdexamfetamine', 'Methylphenidate', 'Atomoxetine', 'Guanfacine', 'Clonidine']
    },
    'Antiseizure Meds': {
        defaultColor: 'rgba(88, 86, 214, 0.2)',   // Indigo
        activeColor: 'rgba(88, 86, 214, 0.8)',
        drugs: ['Phenytoin', 'Carbamazepine', 'Lamotrigine', 'Gabapentin', 'Pregabalin', 'Vigabatrin', 'Valproate', 'Levetiracetam', 'Topiramate', 'Zonisamide']
    },
    'Dopamine Pathway': {
        defaultColor: 'rgba(175, 82, 222, 0.2)',  // Violet
        activeColor: 'rgba(175, 82, 222, 0.8)',
        drugs: ['Levodopa/Carbidopa', 'Pramipexole', 'Ropinirole', 'Rotigotine', 'Selegiline', 'Rasagiline', 'Entacapone', 'Amantadine', 'Trihexyphenidyl', 'Benztropine']
    },
    'Cholinesterase Inhibitors': {
        defaultColor: 'rgba(255, 45, 85, 0.2)',   // Pink
        activeColor: 'rgba(255, 45, 85, 0.8)',
        drugs: ['Donepezil', 'Rivastigmine', 'Galantamine', 'Memantine', 'Pyridostigmine']
    },
    'Vascular': {
        defaultColor: 'rgba(139, 69, 19, 0.2)',   // Brown
        activeColor: 'rgba(139, 69, 19, 0.8)',
        drugs: ['Aspirin', 'Clopidogrel', 'Ticagrelor', 'Apixaban', 'Rivaroxaban']
    }
};

// Use configuration from config.js

// Drug interaction cache to minimize API calls
let interactionCache = new Map();
let drugIdCache = new Map();

// Enhanced Static Interaction Database (replaces discontinued RxNav API)
const drugInteractionDatabase = {
    // Antidepressant interactions
    'Sertraline-Tramadol': {
        severity: 'high',
        effects: 'Increased risk of serotonin syndrome: hyperthermia, muscle rigidity, mental status changes',
        mechanism: 'Both drugs increase serotonin levels',
        management: 'Avoid combination, use alternative analgesic'
    },
    'Fluoxetine-Phenelzine': {
        severity: 'high',
        effects: 'Severe serotonin syndrome risk, potentially fatal',
        mechanism: 'SSRI + MAOI combination',
        management: '14-day washout period required when switching'
    },
    'Fluoxetine-Tramadol': {
        severity: 'high',
        effects: 'Serotonin syndrome, seizure risk increased',
        mechanism: 'Additive serotonergic effects',
        management: 'Avoid combination or monitor closely'
    },
    'Venlafaxine-Phenelzine': {
        severity: 'high',
        effects: 'Hypertensive crisis, serotonin syndrome',
        mechanism: 'SNRI + MAOI interaction',
        management: '14-day washout required'
    },
    'Sertraline-Phenelzine': {
        severity: 'high',
        effects: 'Serotonin syndrome, hypertensive crisis',
        mechanism: 'SSRI + MAOI combination',
        management: '14-day washout period required'
    },

    // Antipsychotic interactions
    'Haloperidol-Lithium': {
        severity: 'moderate',
        effects: 'Increased extrapyramidal symptoms, neurotoxicity',
        mechanism: 'Additive neurological effects',
        management: 'Monitor neurological status closely'
    },
    'Clozapine-Fluvoxamine': {
        severity: 'high',
        effects: 'Significantly increased clozapine levels, toxicity risk',
        mechanism: 'CYP1A2 inhibition by fluvoxamine',
        management: 'Reduce clozapine dose by 50% if combination necessary'
    },
    'Olanzapine-Carbamazepine': {
        severity: 'moderate',
        effects: 'Decreased olanzapine efficacy',
        mechanism: 'CYP1A2 induction reduces olanzapine levels',
        management: 'May need to increase olanzapine dose'
    },
    'Risperidone-Fluoxetine': {
        severity: 'moderate',
        effects: 'Increased risperidone levels and side effects',
        mechanism: 'CYP2D6 inhibition by fluoxetine',
        management: 'Monitor for increased antipsychotic side effects'
    },

    // Anticoagulant/Antiplatelet interactions
    'Aspirin-Clopidogrel': {
        severity: 'moderate',
        effects: 'Increased bleeding risk, enhanced antiplatelet effect',
        mechanism: 'Dual antiplatelet therapy',
        management: 'Standard combination for ACS, monitor for bleeding'
    },
    'Apixaban-Aspirin': {
        severity: 'moderate',
        effects: 'Increased bleeding risk',
        mechanism: 'Anticoagulant + antiplatelet combination',
        management: 'Use low-dose aspirin, monitor for bleeding'
    },
    'Rivaroxaban-Clopidogrel': {
        severity: 'high',
        effects: 'Major bleeding risk',
        mechanism: 'Anticoagulant + antiplatelet combination',
        management: 'Generally avoid, use only if essential with close monitoring'
    },
    'Apixaban-Rivaroxaban': {
        severity: 'high',
        effects: 'Excessive anticoagulation, severe bleeding risk',
        mechanism: 'Dual anticoagulation',
        management: 'Never combine two anticoagulants'
    },
    'Ticagrelor-Aspirin': {
        severity: 'moderate',
        effects: 'Increased bleeding risk, standard dual antiplatelet therapy',
        mechanism: 'Combined antiplatelet effects',
        management: 'Use low-dose aspirin (75-100mg), monitor bleeding'
    },

    // Mood stabilizer interactions
    'Lithium-Valproate': {
        severity: 'moderate',
        effects: 'Increased tremor, potential neural tube defects in pregnancy',
        mechanism: 'Additive neurological effects',
        management: 'Monitor neurological symptoms, avoid in pregnancy'
    },
    'Lithium-Carbamazepine': {
        severity: 'moderate',
        effects: 'Increased neurotoxicity risk',
        mechanism: 'Additive CNS effects',
        management: 'Monitor lithium levels and neurological symptoms'
    },
    'Carbamazepine-Valproate': {
        severity: 'moderate',
        effects: 'Complex pharmacokinetic interactions',
        mechanism: 'Mutual enzyme induction/inhibition',
        management: 'Monitor levels of both drugs'
    },
    'Lamotrigine-Valproate': {
        severity: 'moderate',
        effects: 'Increased lamotrigine levels, severe rash risk',
        mechanism: 'Valproate inhibits lamotrigine glucuronidation',
        management: 'Reduce lamotrigine dose by 50% with slow titration'
    },

    // Benzodiazepine interactions
    'Lorazepam-Olanzapine': {
        severity: 'moderate',
        effects: 'Excessive sedation, respiratory depression risk',
        mechanism: 'Additive CNS depression',
        management: 'Use lowest effective doses, monitor closely'
    },
    'Clonazepam-Quetiapine': {
        severity: 'moderate',
        effects: 'Enhanced sedation, cognitive impairment',
        mechanism: 'Additive sedating effects',
        management: 'Monitor for excessive sedation'
    },
    'Diazepam-Fluoxetine': {
        severity: 'moderate',
        effects: 'Prolonged sedation due to decreased diazepam clearance',
        mechanism: 'CYP2C19 and CYP3A4 inhibition by fluoxetine',
        management: 'Consider shorter-acting benzodiazepine'
    },

    // ADHD medication interactions
    'Methylphenidate-Phenelzine': {
        severity: 'high',
        effects: 'Hypertensive crisis risk',
        mechanism: 'MAOIs potentiate stimulant effects',
        management: 'Avoid combination completely'
    },
    'Atomoxetine-Fluoxetine': {
        severity: 'moderate',
        effects: 'Increased atomoxetine levels and side effects',
        mechanism: 'CYP2D6 inhibition by fluoxetine',
        management: 'Monitor for increased ADHD medication side effects'
    },
    'Amphetamine-Sertraline': {
        severity: 'moderate',
        effects: 'Increased risk of serotonin syndrome',
        mechanism: 'Both affect serotonergic systems',
        management: 'Monitor for serotonin syndrome symptoms'
    },

    // Additional clinically significant interactions
    'Tramadol-Venlafaxine': {
        severity: 'high',
        effects: 'Serotonin syndrome, seizure risk',
        mechanism: 'Both increase serotonin and lower seizure threshold',
        management: 'Avoid combination, use alternative analgesic'
    },
    'Bupropion-Tramadol': {
        severity: 'moderate',
        effects: 'Increased seizure risk',
        mechanism: 'Both drugs lower seizure threshold',
        management: 'Use with caution, monitor for seizure activity'
    },
    'Trazodone-Sertraline': {
        severity: 'moderate',
        effects: 'Increased serotonin syndrome risk',
        mechanism: 'Additive serotonergic effects',
        management: 'Monitor for serotonin syndrome symptoms'
    }
};

// Global variables
let selectedMedications = [];
let selectedDrugs = new Set();
let svgElement;

// Drug Information Database
const drugInfoDatabase = {
    // Antidepressants - SSRIs
    'Fluoxetine': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI), long half-life',
        indications: 'Major depression, OCD, bulimia, panic disorder, PMDD',
        dosing: '20-80mg daily, start 20mg daily, long elimination half-life',
        sideEffects: 'Nausea, sexual dysfunction, insomnia, anxiety, activation, long half-life effects'
    },
    'Sertraline': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI)',
        indications: 'Major depression, OCD, panic disorder, PTSD, social anxiety disorder',
        dosing: '50-200mg daily, start 50mg daily with food',
        sideEffects: 'Nausea, sexual dysfunction, insomnia, headache, GI upset, diarrhea'
    },
    'Paroxetine': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI), potent CYP2D6 inhibitor',
        indications: 'Major depression, panic disorder, social anxiety, GAD, PTSD',
        dosing: '20-50mg daily, start 20mg daily, take with food',
        sideEffects: 'Sedation, weight gain, sexual dysfunction, anticholinergic effects, discontinuation syndrome'
    },
    'Citalopram': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI)',
        indications: 'Major depressive disorder',
        dosing: '20-40mg daily, start 20mg daily, max 40mg (20mg elderly)',
        sideEffects: 'Nausea, sexual dysfunction, QT prolongation risk, drowsiness'
    },
    'Escitalopram': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI), S-enantiomer of citalopram',
        indications: 'Major depression, generalized anxiety disorder',
        dosing: '10-20mg daily, start 10mg daily',
        sideEffects: 'Nausea, sexual dysfunction, insomnia, fatigue, headache'
    },
    'Fluvoxamine': {
        moa: 'Selective serotonin reuptake inhibitor (SSRI), strong CYP1A2 inhibitor',
        indications: 'OCD, social anxiety disorder',
        dosing: '100-300mg daily, start 50mg daily, divided doses >150mg',
        sideEffects: 'Nausea, sedation, drug interactions via CYP1A2, sexual dysfunction'
    },

    // Antidepressants - SNRIs
    'Venlafaxine': {
        moa: 'Serotonin-norepinephrine reuptake inhibitor (SNRI)',
        indications: 'Major depression, GAD, panic disorder, social anxiety',
        dosing: '75-375mg daily, start 75mg daily with food',
        sideEffects: 'Nausea, hypertension, sexual dysfunction, severe discontinuation syndrome'
    },
    'Duloxetine': {
        moa: 'Serotonin-norepinephrine reuptake inhibitor (SNRI)',
        indications: 'Major depression, GAD, diabetic neuropathy, fibromyalgia',
        dosing: '60-120mg daily, start 30mg daily, take with food',
        sideEffects: 'Nausea, dry mouth, constipation, dizziness, hepatotoxicity risk'
    },

    // Antidepressants - TCAs
    'Amitriptyline': {
        moa: 'Tricyclic antidepressant, blocks serotonin/norepinephrine reuptake',
        indications: 'Major depression, neuropathic pain, migraine prevention',
        dosing: '25-300mg daily, start 25mg daily, usually at bedtime',
        sideEffects: 'Anticholinergic effects, sedation, weight gain, cardiac conduction delays'
    },
    'Nortriptyline': {
        moa: 'Tricyclic antidepressant, selective norepinephrine reuptake inhibitor',
        indications: 'Major depression, neuropathic pain, smoking cessation',
        dosing: '25-150mg daily, therapeutic level 50-150 ng/mL',
        sideEffects: 'Less anticholinergic than amitriptyline, orthostatic hypotension, cardiac effects'
    },

    // Antidepressants - MAOIs
    'Phenelzine': {
        moa: 'Irreversible monoamine oxidase inhibitor (MAOI), non-selective',
        indications: 'Major depression (treatment-resistant), social anxiety, panic disorder',
        dosing: '45-90mg daily in divided doses, start 15mg TID',
        sideEffects: 'Hypertensive crisis risk, dietary restrictions, orthostatic hypotension, weight gain'
    },
    'Tranylcypromine': {
        moa: 'Irreversible monoamine oxidase inhibitor (MAOI), non-selective',
        indications: 'Major depression (treatment-resistant)',
        dosing: '30-60mg daily in divided doses, start 10mg BID',
        sideEffects: 'Hypertensive crisis risk, dietary restrictions, insomnia, stimulant-like effects'
    },

    // Antidepressants - Atypical
    'Bupropion': {
        moa: 'Norepinephrine-dopamine reuptake inhibitor (NDRI)',
        indications: 'Major depression, smoking cessation, ADHD (off-label), sexual dysfunction',
        dosing: '300-450mg daily, start 150mg daily, avoid evening doses',
        sideEffects: 'Seizure risk, insomnia, dry mouth, weight loss, no sexual side effects'
    },
    'Mirtazapine': {
        moa: 'Noradrenergic and specific serotonergic antidepressant (NaSSA)',
        indications: 'Major depression, appetite stimulation, insomnia',
        dosing: '15-45mg daily at bedtime, start 15mg daily',
        sideEffects: 'Sedation, weight gain, increased appetite, agranulocytosis (rare)'
    },
    'Trazodone': {
        moa: 'Serotonin antagonist and reuptake inhibitor (SARI)',
        indications: 'Major depression, insomnia (off-label)',
        dosing: '150-400mg daily for depression, 25-100mg for sleep',
        sideEffects: 'Sedation, orthostatic hypotension, priapism (rare), cardiac arrhythmias'
    },
    'Nefazodone': {
        moa: 'Serotonin antagonist and reuptake inhibitor (SARI)',
        indications: 'Major depression (limited use due to hepatotoxicity)',
        dosing: '300-600mg daily in divided doses, start 200mg daily',
        sideEffects: 'Hepatotoxicity (black box warning), sedation, visual disturbances'
    },
    'Vortioxetine': {
        moa: 'Multimodal serotonin modulator (5-HT3/7/1D antagonist, 5-HT1A agonist, SERT inhibitor)',
        indications: 'Major depressive disorder',
        dosing: '10-20mg daily, start 10mg daily',
        sideEffects: 'Nausea, sexual dysfunction, cognitive enhancement, vomiting'
    },
    'Vilazodone': {
        moa: 'Serotonin reuptake inhibitor and 5-HT1A partial agonist',
        indications: 'Major depressive disorder',
        dosing: '40mg daily with food, titrate over 2 weeks',
        sideEffects: 'Nausea, diarrhea, insomnia, reduced sexual side effects vs SSRIs'
    },

    // Antipsychotics - Typical (First Generation)
    'Haloperidol': {
        moa: 'Typical antipsychotic, high-potency D2 receptor antagonist',
        indications: 'Schizophrenia, acute psychosis, Tourette syndrome, delirium',
        dosing: '2-20mg daily, start 2-5mg daily, available IM and PO',
        sideEffects: 'High EPS risk, tardive dyskinesia, QT prolongation, neuroleptic malignant syndrome'
    },
    'Chlorpromazine': {
        moa: 'Typical antipsychotic, low-potency D2 receptor antagonist',
        indications: 'Schizophrenia, bipolar mania, intractable hiccups, nausea/vomiting',
        dosing: '200-800mg daily divided, start 25-100mg daily',
        sideEffects: 'Sedation, anticholinergic effects, hypotension, photosensitivity, seizure risk'
    },

    // Antipsychotics - Atypical (Second Generation)
    'Olanzapine': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist',
        indications: 'Schizophrenia, bipolar I disorder (manic/mixed episodes), agitation',
        dosing: '5-20mg daily, target 10mg/day, available IM',
        sideEffects: 'Significant weight gain, metabolic syndrome, diabetes risk, sedation'
    },
    'Risperidone': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist',
        indications: 'Schizophrenia, bipolar disorder, autism irritability, elderly agitation',
        dosing: '2-8mg daily, start 1-2mg daily, available long-acting injection',
        sideEffects: 'Hyperprolactinemia, weight gain, EPS (dose-dependent), sedation'
    },
    'Aripiprazole': {
        moa: 'Dopamine D2 partial agonist, 5-HT2A antagonist, dopamine stabilizer',
        indications: 'Schizophrenia, bipolar disorder, major depression (adjunct), autism irritability',
        dosing: '10-30mg daily, start 10-15mg daily, available LAI',
        sideEffects: 'Akathisia, nausea, restlessness, minimal weight gain, insomnia'
    },
    'Quetiapine': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist, strong H1 antihistamine',
        indications: 'Schizophrenia, bipolar disorder, major depression (adjunct), insomnia (off-label)',
        dosing: '150-800mg daily divided, start 25mg BID, XR available',
        sideEffects: 'Sedation, weight gain, hypotension, diabetes risk, cataracts'
    },
    'Clozapine': {
        moa: 'Atypical antipsychotic, D4 > D2 affinity, multiple receptor activity',
        indications: 'Treatment-resistant schizophrenia, suicide risk reduction in schizophrenia',
        dosing: '300-450mg daily divided, start 12.5mg daily, requires monitoring',
        sideEffects: 'Agranulocytosis (requires WBC monitoring), seizures, myocarditis, weight gain'
    },
    'Ziprasidone': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist, 5-HT1A agonist',
        indications: 'Schizophrenia, bipolar disorder acute mania',
        dosing: '40-160mg daily with food, start 20mg BID',
        sideEffects: 'QT prolongation, minimal weight gain, akathisia, sedation'
    },
    'Paliperidone': {
        moa: '2nd generation antipsychotic, active metabolite of risperidone',
        indications: 'Schizophrenia, schizoaffective disorder',
        dosing: '6-12mg daily, start 6mg daily, available as LAI',
        sideEffects: 'Similar to risperidone: hyperprolactinemia, weight gain, EPS'
    },
    'Asenapine': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist',
        indications: 'Schizophrenia, bipolar disorder acute mania',
        dosing: '10-20mg daily divided, sublingual administration',
        sideEffects: 'Weight gain, sedation, oral hypoesthesia, dysgeusia'
    },
    'Lurasidone': {
        moa: '2nd generation antipsychotic, D2/5-HT2A antagonist, 5-HT7 antagonist',
        indications: 'Schizophrenia, bipolar depression',
        dosing: '40-160mg daily with food (≥350 calories)',
        sideEffects: 'Akathisia, nausea, minimal weight gain, sedation'
    },

    // Mood Stabilizers
    'Lithium': {
        moa: 'Mood stabilizer, affects sodium transport, neuroprotective effects',
        indications: 'Bipolar disorder maintenance, acute mania, depression prevention',
        dosing: '600-1800mg daily divided, target level 0.6-1.2 mEq/L, requires monitoring',
        sideEffects: 'Tremor, polyuria, polydipsia, weight gain, thyroid/kidney toxicity, teratogenic'
    },
    'Valproate': {
        moa: 'Anticonvulsant, increases GABA, blocks sodium channels',
        indications: 'Bipolar disorder acute mania, maintenance, migraine prevention',
        dosing: '500-2000mg daily, target level 50-125 mcg/mL',
        sideEffects: 'Weight gain, hair loss, tremor, hepatotoxicity, teratogenicity, PCOS'
    },
    'Carbamazepine': {
        moa: 'Anticonvulsant, blocks sodium channels, mood stabilizer',
        indications: 'Bipolar disorder, trigeminal neuralgia, partial seizures',
        dosing: '400-1200mg daily divided, target level 4-12 mcg/mL',
        sideEffects: 'Dizziness, diplopia, hyponatremia, Stevens-Johnson syndrome, blood dyscrasias'
    },
    'Lamotrigine': {
        moa: 'Anticonvulsant, blocks sodium channels, glutamate release inhibition',
        indications: 'Bipolar disorder maintenance, partial seizures, bipolar depression',
        dosing: '100-400mg daily, slow titration required (25mg every 2 weeks)',
        sideEffects: 'Stevens-Johnson syndrome (rash), dizziness, blurred vision, insomnia'
    },

    // Anxiolytics & Sedatives - Benzodiazepines
    'Lorazepam': {
        moa: 'Benzodiazepine, GABA-A receptor positive allosteric modulator',
        indications: 'Anxiety disorders, panic attacks, alcohol withdrawal, status epilepticus',
        dosing: '0.5-6mg daily divided, start 0.5mg BID-TID, short-acting',
        sideEffects: 'Sedation, dependence potential, cognitive impairment, respiratory depression'
    },
    'Diazepam': {
        moa: 'Benzodiazepine, GABA-A receptor positive allosteric modulator',
        indications: 'Anxiety disorders, alcohol withdrawal, muscle spasms, seizures',
        dosing: '2-40mg daily divided, long half-life with active metabolites',
        sideEffects: 'Sedation, dependence potential, cognitive impairment, long duration'
    },
    'Clonazepam': {
        moa: 'Benzodiazepine, GABA-A receptor positive allosteric modulator',
        indications: 'Panic disorder, seizure disorders, anxiety, REM sleep behavior disorder',
        dosing: '0.5-4mg daily divided, start 0.25mg BID, intermediate-acting',
        sideEffects: 'Sedation, dependence potential, cognitive impairment, long half-life'
    },
    'Alprazolam': {
        moa: 'Benzodiazepine, GABA-A receptor positive allosteric modulator',
        indications: 'Panic disorder, anxiety disorders',
        dosing: '0.25-4mg daily divided, start 0.25mg TID, short-acting',
        sideEffects: 'High dependence potential, rebound anxiety, cognitive impairment'
    },

    // Anxiolytics & Sedatives - Non-Benzodiazepines
    'Buspirone': {
        moa: '5-HT1A partial agonist, anxiolytic',
        indications: 'Generalized anxiety disorder, augmentation for depression',
        dosing: '15-60mg daily divided, start 7.5mg BID, take with food',
        sideEffects: 'Dizziness, nausea, headache, no dependence potential, delayed onset'
    },
    'Hydroxyzine': {
        moa: 'Antihistamine (H1 antagonist), anxiolytic properties',
        indications: 'Anxiety, allergic reactions, pruritus, sleep aid',
        dosing: '25-100mg QID for anxiety, 25-50mg for sleep',
        sideEffects: 'Sedation, dry mouth, QT prolongation potential, anticholinergic effects'
    },
    'Propranolol': {
        moa: 'Non-selective beta-blocker, blocks peripheral anxiety symptoms',
        indications: 'Performance anxiety, social anxiety, hypertension, migraine prevention',
        dosing: '10-80mg for performance anxiety, 80-320mg daily for other indications',
        sideEffects: 'Bradycardia, hypotension, bronchospasm, fatigue, contraindicated in asthma'
    },

    // Anxiolytics & Sedatives - Z-drugs
    'Zolpidem': {
        moa: 'Non-benzodiazepine hypnotic, GABA-A receptor α1 subunit selective agonist',
        indications: 'Short-term insomnia treatment (7-10 days)',
        dosing: '5-10mg at bedtime, 5mg for elderly/women, immediate and CR formulations',
        sideEffects: 'Next-day drowsiness, complex sleep behaviors, dependence potential'
    },
    'Eszopiclone': {
        moa: 'Non-benzodiazepine hypnotic, GABA-A receptor modulator',
        indications: 'Insomnia (sleep onset and maintenance)',
        dosing: '1-3mg at bedtime, start 1mg (elderly), longer-term use approved',
        sideEffects: 'Metallic taste, next-day drowsiness, complex sleep behaviors'
    },
    'Zaleplon': {
        moa: 'Non-benzodiazepine hypnotic, GABA-A receptor α1 subunit selective agonist',
        indications: 'Short-term insomnia treatment (sleep onset)',
        dosing: '5-20mg at bedtime, ultra-short acting (1-hour half-life)',
        sideEffects: 'Minimal next-day effects, dizziness, complex sleep behaviors'
    },

    // Stimulants / ADHD Medications
    'Methylphenidate': {
        moa: 'Dopamine/norepinephrine reuptake inhibitor, CNS stimulant',
        indications: 'ADHD, narcolepsy',
        dosing: '5-60mg daily divided, multiple formulations (IR, SR, XR, patch)',
        sideEffects: 'Appetite suppression, insomnia, growth suppression in children, cardiovascular effects'
    },
    'Amphetamine': {
        moa: 'Dopamine/norepinephrine releaser and reuptake inhibitor',
        indications: 'ADHD, narcolepsy',
        dosing: '5-40mg daily divided, mixed salts available',
        sideEffects: 'Appetite suppression, insomnia, cardiovascular effects, higher abuse potential'
    },
    'Dextroamphetamine': {
        moa: 'Dopamine/norepinephrine releaser and reuptake inhibitor',
        indications: 'ADHD, narcolepsy',
        dosing: '5-40mg daily divided, pure dextro-isomer',
        sideEffects: 'Similar to amphetamine, potentially more potent CNS effects'
    },
    'Lisdexamfetamine': {
        moa: 'Prodrug of dextroamphetamine, dopamine/norepinephrine activity',
        indications: 'ADHD, binge eating disorder',
        dosing: '30-70mg daily, once-daily dosing, lower abuse potential',
        sideEffects: 'Similar to amphetamines but smoother onset/offset'
    },
    'Atomoxetine': {
        moa: 'Selective norepinephrine reuptake inhibitor, non-stimulant',
        indications: 'ADHD (children and adults), alternative to stimulants',
        dosing: '40-100mg daily, start 40mg daily, can divide doses',
        sideEffects: 'Nausea, decreased appetite, fatigue, mood changes, hepatotoxicity (rare)'
    },
    'Guanfacine': {
        moa: 'Alpha-2A adrenergic agonist, non-stimulant',
        indications: 'ADHD (adjunct to stimulants), hypertension',
        dosing: '1-4mg daily, extended-release preferred for ADHD',
        sideEffects: 'Sedation, hypotension, bradycardia, rebound hypertension if stopped abruptly'
    },
    'Clonidine': {
        moa: 'Alpha-2 adrenergic agonist, non-stimulant',
        indications: 'ADHD (adjunct), hypertension, Tourette syndrome',
        dosing: '0.1-0.4mg daily divided, patch available',
        sideEffects: 'Sedation, hypotension, dry mouth, rebound hypertension'
    },

    // Anticonvulsants/Mood Stabilizers (Additional)
    'Phenytoin': {
        moa: 'Sodium channel blocker, anticonvulsant',
        indications: 'Tonic-clonic seizures, partial seizures, status epilepticus',
        dosing: '300-400mg daily, target level 10-20 mcg/mL',
        sideEffects: 'Gingival hyperplasia, hirsutism, ataxia, Stevens-Johnson syndrome'
    },
    'Gabapentin': {
        moa: 'Calcium channel modulator (α2δ subunit), GABA analog',
        indications: 'Partial seizures, neuropathic pain, restless leg syndrome',
        dosing: '300-3600mg daily divided, start 300mg daily',
        sideEffects: 'Sedation, dizziness, weight gain, peripheral edema'
    },
    'Pregabalin': {
        moa: 'Calcium channel modulator (α2δ subunit), GABA analog',
        indications: 'Neuropathic pain, fibromyalgia, partial seizures, GAD',
        dosing: '150-600mg daily divided, start 75mg BID',
        sideEffects: 'Sedation, dizziness, weight gain, peripheral edema, controlled substance'
    },
    'Topiramate': {
        moa: 'Multiple mechanisms: sodium channel blocker, GABA enhancement, glutamate antagonist',
        indications: 'Partial seizures, migraine prevention, weight loss (off-label)',
        dosing: '100-400mg daily divided, slow titration required',
        sideEffects: 'Cognitive impairment, weight loss, kidney stones, acute angle-closure glaucoma'
    },
    'Levetiracetam': {
        moa: 'SV2A protein binding, broad-spectrum anticonvulsant',
        indications: 'Partial seizures, myoclonic seizures, generalized tonic-clonic seizures',
        dosing: '1000-3000mg daily divided, start 500mg BID',
        sideEffects: 'Behavioral changes, irritability, sedation, rare blood dyscrasias'
    },

    // Dopamine Pathway Medications
    'Levodopa': {
        moa: 'Dopamine precursor, converted to dopamine in brain',
        indications: 'Parkinson\'s disease, restless leg syndrome',
        dosing: 'Always combined with carbidopa, 25/100 to 25/250mg TID-QID',
        sideEffects: 'Dyskinesias, nausea, orthostatic hypotension, hallucinations'
    },
    'Pramipexole': {
        moa: 'Dopamine D2/D3 receptor agonist',
        indications: 'Parkinson\'s disease, restless leg syndrome',
        dosing: '0.375-4.5mg daily divided, start 0.125mg TID',
        sideEffects: 'Impulse control disorders, sedation, orthostatic hypotension, hallucinations'
    },
    'Ropinirole': {
        moa: 'Dopamine D2/D3 receptor agonist',
        indications: 'Parkinson\'s disease, restless leg syndrome',
        dosing: '3-24mg daily divided, start 0.25mg TID',
        sideEffects: 'Similar to pramipexole: impulse control disorders, sedation, nausea'
    },
    'Selegiline': {
        moa: 'MAO-B inhibitor, increases dopamine availability',
        indications: 'Parkinson\'s disease (adjunct to levodopa)',
        dosing: '5-10mg daily divided, avoid tyramine at higher doses',
        sideEffects: 'Insomnia, nausea, orthostatic hypotension, potential serotonin syndrome'
    },
    'Rasagiline': {
        moa: 'Irreversible MAO-B inhibitor',
        indications: 'Parkinson\'s disease (monotherapy or adjunct)',
        dosing: '0.5-1mg daily, once-daily dosing',
        sideEffects: 'Dyskinesias, arthralgia, depression, hallucinations'
    },
    'Amantadine': {
        moa: 'NMDA receptor antagonist, dopamine releaser',
        indications: 'Parkinson\'s disease, drug-induced EPS, levodopa-induced dyskinesias',
        dosing: '100-400mg daily divided, adjust for renal function',
        sideEffects: 'Livedo reticularis, ankle edema, confusion, hallucinations'
    },
    'Entacapone': {
        moa: 'COMT inhibitor, prolongs levodopa effect',
        indications: 'Parkinson\'s disease (adjunct to levodopa/carbidopa)',
        dosing: '200mg with each levodopa dose, max 8 doses/day',
        sideEffects: 'Dyskinesias, nausea, orange urine discoloration, diarrhea'
    },
    'Trihexyphenidyl': {
        moa: 'Anticholinergic (muscarinic antagonist)',
        indications: 'Parkinson\'s disease, drug-induced EPS',
        dosing: '5-15mg daily divided, start 1mg daily',
        sideEffects: 'Anticholinergic effects: dry mouth, constipation, confusion, urinary retention'
    },
    'Benztropine': {
        moa: 'Anticholinergic (muscarinic antagonist)',
        indications: 'Drug-induced EPS, Parkinson\'s disease',
        dosing: '1-6mg daily divided, available IM/IV for acute EPS',
        sideEffects: 'Similar anticholinergic profile to trihexyphenidyl'
    },

    // Cholinesterase Inhibitors & Dementia Medications
    'Donepezil': {
        moa: 'Reversible acetylcholinesterase inhibitor',
        indications: 'Alzheimer\'s dementia (mild to severe)',
        dosing: '5-23mg daily, start 5mg daily, take at bedtime',
        sideEffects: 'Nausea, diarrhea, insomnia, muscle cramps, bradycardia'
    },
    'Rivastigmine': {
        moa: 'Reversible cholinesterase inhibitor (AChE and BuChE)',
        indications: 'Alzheimer\'s dementia, Parkinson\'s disease dementia',
        dosing: '3-12mg daily divided, patch available, take with food',
        sideEffects: 'Nausea, vomiting, weight loss, diarrhea, patch site reactions'
    },
    'Galantamine': {
        moa: 'Cholinesterase inhibitor + nicotinic receptor allosteric modulator',
        indications: 'Alzheimer\'s dementia (mild to moderate)',
        dosing: '16-24mg daily divided, start 4mg BID with food',
        sideEffects: 'Nausea, vomiting, diarrhea, weight loss, bradycardia'
    },
    'Memantine': {
        moa: 'NMDA receptor antagonist, neuroprotective',
        indications: 'Alzheimer\'s dementia (moderate to severe)',
        dosing: '10-20mg daily divided, start 5mg daily, titrate weekly',
        sideEffects: 'Confusion, dizziness, headache, constipation, generally well-tolerated'
    },

    // Vascular Medications
    'Aspirin': {
        moa: 'Irreversible COX-1 inhibitor, blocks thromboxane A2 synthesis',
        indications: 'Cardiovascular prevention, MI/stroke secondary prevention, antiplatelet therapy',
        dosing: '75-100mg daily for cardioprotection, 160-325mg for acute events',
        sideEffects: 'GI bleeding, peptic ulcers, tinnitus, nephrotoxicity, increased bleeding risk'
    },
    'Clopidogrel': {
        moa: 'Irreversible P2Y12 receptor antagonist, requires CYP2C19 activation',
        indications: 'ACS, recent MI/stroke/PAD, coronary stent thrombosis prevention',
        dosing: '75mg daily maintenance, 300-600mg loading dose for ACS',
        sideEffects: 'Bleeding risk, TTP (rare), CYP2C19 poor metabolizers have reduced efficacy'
    },
    'Ticagrelor': {
        moa: 'Reversible P2Y12 receptor antagonist, direct acting (no metabolic activation)',
        indications: 'ACS, CAD high-risk patients, stroke prevention, MI prevention',
        dosing: '90mg BID (first year post-ACS), 60mg BID (long-term), 180mg loading dose',
        sideEffects: 'Dyspnea, bleeding risk, ventricular pauses, gout, CYP3A4 interactions'
    },
    'Apixaban': {
        moa: 'Direct factor Xa inhibitor, oral anticoagulant',
        indications: 'Atrial fibrillation stroke prevention, DVT/PE treatment and prevention',
        dosing: '5mg BID (AF), 2.5mg BID if 2+ risk factors, 10mg BID x7 days then 5mg BID (VTE)',
        sideEffects: 'Bleeding risk, no routine monitoring needed, fewer drug interactions than warfarin'
    },
    'Rivaroxaban': {
        moa: 'Direct factor Xa inhibitor, oral anticoagulant',
        indications: 'Atrial fibrillation stroke prevention, DVT/PE treatment, CAD/PAD risk reduction',
        dosing: '20mg daily with food (AF), 15mg BID x21 days then 20mg daily (VTE)',
        sideEffects: 'Bleeding risk, take with food for absorption, CYP3A4/P-gp interactions'
    }
};

// DrugBank API Functions
async function fetchDrugId(drugName) {
    // Check cache first
    if (drugIdCache.has(drugName)) {
        return drugIdCache.get(drugName);
    }

    try {
        const auth = btoa(`${window.DRUGBANK_CONFIG.username}:${window.DRUGBANK_CONFIG.password}`);
        const response = await fetch(`${window.DRUGBANK_CONFIG.baseURL}/drugs/search?q=${encodeURIComponent(drugName)}&type=name`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
            const drugId = data[0].drugbank_id;
            drugIdCache.set(drugName, drugId);
            return drugId;
        }
    } catch (error) {
        console.warn(`Could not fetch DrugBank ID for ${drugName}:`, error);
        return null;
    }
    return null;
}

async function fetchDrugInteractions(drug1Name, drug2Name) {
    const cacheKey = `${drug1Name}-${drug2Name}`;
    const reverseCacheKey = `${drug2Name}-${drug1Name}`;

    // Check cache first
    if (interactionCache.has(cacheKey)) {
        return interactionCache.get(cacheKey);
    }
    if (interactionCache.has(reverseCacheKey)) {
        return interactionCache.get(reverseCacheKey);
    }

    try {
        const drug1Id = await fetchDrugId(drug1Name);
        const drug2Id = await fetchDrugId(drug2Name);

        if (!drug1Id || !drug2Id) {
            return null;
        }

        const auth = btoa(`${window.DRUGBANK_CONFIG.username}:${window.DRUGBANK_CONFIG.password}`);
        const response = await fetch(`${window.DRUGBANK_CONFIG.baseURL}/drugs/${drug1Id}/drug_interactions`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Find interaction with the second drug
        const interaction = data.find(int =>
            int.drugbank_id === drug2Id ||
            int.name?.toLowerCase().includes(drug2Name.toLowerCase())
        );

        if (interaction) {
            const result = {
                severity: mapSeverity(interaction.severity || 'moderate'),
                effects: interaction.description || 'Drug interaction detected - consult prescribing information',
                source: 'drugbank',
                mechanism: interaction.mechanism || '',
                management: interaction.management || ''
            };

            // Cache the result
            interactionCache.set(cacheKey, result);
            return result;
        }

    } catch (error) {
        console.warn(`Error fetching interaction between ${drug1Name} and ${drug2Name}:`, error);
    }

    return null;
}

function mapSeverity(drugbankSeverity) {
    const severity = drugbankSeverity?.toLowerCase() || '';
    if (severity.includes('major') || severity.includes('contraindicated')) {
        return 'high';
    } else if (severity.includes('moderate')) {
        return 'moderate';
    } else {
        return 'low';
    }
}

// Alternative API: OpenFDA (free, no authentication required)
async function fetchOpenFDAInteraction(drug1Name, drug2Name) {
    try {
        const response = await fetch(
            `https://api.fda.gov/drug/label.json?search=drug_interactions:"${drug1Name}"+AND+drug_interactions:"${drug2Name}"&limit=5`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const interactions = result.drug_interactions || [];

            // Look for interactions mentioning both drugs
            const relevantInteraction = interactions.find(interaction =>
                interaction.toLowerCase().includes(drug1Name.toLowerCase()) &&
                interaction.toLowerCase().includes(drug2Name.toLowerCase())
            );

            if (relevantInteraction) {
                return {
                    severity: 'moderate', // FDA doesn't provide severity classification
                    effects: relevantInteraction,
                    source: 'openFDA'
                };
            }
        }
    } catch (error) {
        console.warn(`OpenFDA lookup failed for ${drug1Name} and ${drug2Name}:`, error);
    }

    return null;
}


// Tab switching function
function switchTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab pane
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activate selected button
    const clickedButton = event.target;
    clickedButton.classList.add('active');

    // Generate side effects table if switching to side effects tab
    if (tabName === 'sideEffects') {
        generateSideEffectsTable();
    }
}

// Side effects data with frequencies
const sideEffectsData = {
    // Common side effects for psychiatric medications
    'Nausea': {
        'Sertraline': '25%', 'Fluoxetine': '22%', 'Escitalopram': '18%', 'Venlafaxine': '35%', 'Duloxetine': '23%',
        'Bupropion': '13%', 'Mirtazapine': '9%', 'Risperidone': '8%', 'Olanzapine': '12%', 'Quetiapine': '15%',
        'Lithium': '20%', 'Lorazepam': '3%', 'Clonazepam': '4%', 'Amphetamine': '12%', 'Methylphenidate': '14%'
    },
    'Drowsiness': {
        'Sertraline': '8%', 'Fluoxetine': '5%', 'Escitalopram': '6%', 'Venlafaxine': '15%', 'Duloxetine': '18%',
        'Bupropion': '2%', 'Mirtazapine': '54%', 'Risperidone': '42%', 'Olanzapine': '52%', 'Quetiapine': '48%',
        'Lithium': '12%', 'Lorazepam': '78%', 'Clonazepam': '72%', 'Amphetamine': '3%', 'Methylphenidate': '2%'
    },
    'Weight Gain': {
        'Sertraline': '8%', 'Fluoxetine': '3%', 'Escitalopram': '5%', 'Venlafaxine': '7%', 'Duloxetine': '2%',
        'Bupropion': '0%', 'Mirtazapine': '49%', 'Risperidone': '18%', 'Olanzapine': '45%', 'Quetiapine': '23%',
        'Lithium': '25%', 'Lorazepam': '5%', 'Clonazepam': '8%', 'Amphetamine': '0%', 'Methylphenidate': '0%'
    },
    'Dry Mouth': {
        'Sertraline': '16%', 'Fluoxetine': '12%', 'Escitalopram': '9%', 'Venlafaxine': '22%', 'Duloxetine': '15%',
        'Bupropion': '31%', 'Mirtazapine': '25%', 'Risperidone': '5%', 'Olanzapine': '9%', 'Quetiapine': '44%',
        'Lithium': '8%', 'Lorazepam': '15%', 'Clonazepam': '12%', 'Amphetamine': '34%', 'Methylphenidate': '25%'
    },
    'Insomnia': {
        'Sertraline': '20%', 'Fluoxetine': '19%', 'Escitalopram': '14%', 'Venlafaxine': '18%', 'Duloxetine': '11%',
        'Bupropion': '19%', 'Mirtazapine': '2%', 'Risperidone': '3%', 'Olanzapine': '1%', 'Quetiapine': '2%',
        'Lithium': '8%', 'Lorazepam': '1%', 'Clonazepam': '1%', 'Amphetamine': '43%', 'Methylphenidate': '39%'
    },
    'Headache': {
        'Sertraline': '25%', 'Fluoxetine': '21%', 'Escitalopram': '24%', 'Venlafaxine': '33%', 'Duloxetine': '18%',
        'Bupropion': '26%', 'Mirtazapine': '8%', 'Risperidone': '12%', 'Olanzapine': '9%', 'Quetiapine': '21%',
        'Lithium': '13%', 'Lorazepam': '6%', 'Clonazepam': '8%', 'Amphetamine': '26%', 'Methylphenidate': '22%'
    },
    'Dizziness': {
        'Sertraline': '17%', 'Fluoxetine': '9%', 'Escitalopram': '5%', 'Venlafaxine': '24%', 'Duloxetine': '18%',
        'Bupropion': '7%', 'Mirtazapine': '7%', 'Risperidone': '8%', 'Olanzapine': '11%', 'Quetiapine': '10%',
        'Lithium': '15%', 'Lorazepam': '18%', 'Clonazepam': '15%', 'Amphetamine': '6%', 'Methylphenidate': '5%'
    },
    'Constipation': {
        'Sertraline': '8%', 'Fluoxetine': '5%', 'Escitalopram': '6%', 'Venlafaxine': '9%', 'Duloxetine': '11%',
        'Bupropion': '10%', 'Mirtazapine': '13%', 'Risperidone': '9%', 'Olanzapine': '11%', 'Quetiapine': '10%',
        'Lithium': '12%', 'Lorazepam': '8%', 'Clonazepam': '10%', 'Amphetamine': '4%', 'Methylphenidate': '6%'
    }
};

// Generate side effects table
function generateSideEffectsTable() {
    const tableContainer = document.getElementById('sideEffectsTable');

    if (!selectedMedications.length) {
        tableContainer.innerHTML = '<p>Please select medications to view side effects comparison.</p>';
        return;
    }

    // Filter medications that exist in our side effects data
    const availableMedications = selectedMedications.filter(med =>
        Object.values(sideEffectsData)[0].hasOwnProperty(med)
    );

    if (!availableMedications.length) {
        tableContainer.innerHTML = '<p>No side effects data available for selected medications.</p>';
        return;
    }

    let tableHTML = '<table class="side-effects-table"><thead><tr>';
    tableHTML += '<th>Side Effect</th>';

    // Add medication columns
    availableMedications.forEach(med => {
        tableHTML += `<th>${med}</th>`;
    });

    tableHTML += '</tr></thead><tbody>';

    // Add rows for each side effect
    Object.entries(sideEffectsData).forEach(([sideEffect, medications]) => {
        tableHTML += `<tr><td>${sideEffect}</td>`;

        availableMedications.forEach(med => {
            const frequency = medications[med] || '-';
            const cssClass = getFrequencyClass(frequency);
            tableHTML += `<td class="${cssClass}">${frequency}</td>`;
        });

        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Helper function to determine frequency class for styling
function getFrequencyClass(frequency) {
    if (frequency === '-' || frequency === '0%') return 'frequency-none';

    const percent = parseInt(frequency);
    if (percent >= 30) return 'frequency-high';
    if (percent >= 15) return 'frequency-moderate';
    return 'frequency-low';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    svgElement = document.getElementById('drugRing');
    drawDrugRing();
    setupEventListeners();
});

function setupEventListeners() {
    const addButton = document.getElementById('addMedication');
    const input = document.getElementById('medicationInput');

    addButton.addEventListener('click', addMedication);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMedication();
        }
    });
}

function addMedication() {
    const input = document.getElementById('medicationInput');
    const medicationName = input.value.trim();

    if (medicationName && !selectedMedications.includes(medicationName)) {
        selectedMedications.push(medicationName);
        updateMedicationList();
        highlightDrugInRing(medicationName);
        input.value = '';
        checkForInteractions();

        // Update side effects table if it's currently visible
        if (document.getElementById('sideEffectsTab').classList.contains('active')) {
            generateSideEffectsTable();
        }
    }
}

function removeMedication(medicationName) {
    selectedMedications = selectedMedications.filter(med => med !== medicationName);
    selectedDrugs.delete(medicationName);
    updateMedicationList();
    unhighlightDrugInRing(medicationName);
    checkForInteractions();

    // Update side effects table if it's currently visible
    if (document.getElementById('sideEffectsTab').classList.contains('active')) {
        generateSideEffectsTable();
    }
}

function updateMedicationList() {
    const list = document.getElementById('medicationList');
    list.innerHTML = '';

    selectedMedications.forEach(medication => {
        const li = document.createElement('li');
        li.className = 'medication-tag';
        li.innerHTML = `
            ${medication}
            <button class="remove-btn" onclick="removeMedication('${medication}')">×</button>
        `;
        list.appendChild(li);
    });
}

function drawDrugRing() {
    const centerX = 400;
    const centerY = 400;
    const ringRadius = 240;
    const ringWidth = 100;
    const innerRadius = ringRadius - ringWidth / 2;
    const outerRadius = ringRadius + ringWidth / 2;

    const classes = Object.keys(drugData);
    const classAngle = (2 * Math.PI) / classes.length;

    classes.forEach((className, classIndex) => {
        const startAngle = classIndex * classAngle - Math.PI / 2;
        const endAngle = (classIndex + 1) * classAngle - Math.PI / 2;
        const drugs = drugData[className].drugs;
        const drugAngle = classAngle / drugs.length;

        // Draw individual drugs as segments around the ring
        drugs.forEach((drug, drugIndex) => {
            const drugStartAngle = startAngle + drugIndex * drugAngle;
            const drugEndAngle = startAngle + (drugIndex + 1) * drugAngle;

            const drugPath = createArcPath(centerX, centerY, innerRadius, outerRadius, drugStartAngle, drugEndAngle);
            const drugElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            drugElement.setAttribute('d', drugPath);
            drugElement.setAttribute('fill', drugData[className].defaultColor);
            drugElement.setAttribute('class', 'drug-segment');
            drugElement.setAttribute('data-drug', drug);
            drugElement.setAttribute('data-class', className);
            drugElement.addEventListener('click', () => toggleDrugSelection(drug));
            drugElement.addEventListener('mouseenter', (e) => {
                showDrugPopup(e, drug);
                applyHoverEffect(drugElement, drugStartAngle, drugEndAngle);
            });
            drugElement.addEventListener('mouseleave', () => {
                hideDrugPopup();
                removeHoverEffect(drugElement);
            });
            drugElement.addEventListener('mousemove', updatePopupPosition);
            svgElement.appendChild(drugElement);

            // Add drug label with proper orientation
            const labelAngle = (drugStartAngle + drugEndAngle) / 2;
            const labelRadius = ringRadius;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', labelX);
            label.setAttribute('y', labelY);
            label.setAttribute('class', 'drug-label');

            // Fix orientation - keep text readable
            let rotationAngle = (labelAngle * 180) / Math.PI;
            if (rotationAngle > 90 && rotationAngle < 270) {
                rotationAngle += 180;
            }
            label.setAttribute('transform', `rotate(${rotationAngle}, ${labelX}, ${labelY})`);
            label.textContent = drug;
            svgElement.appendChild(label);
        });

        // Add class label outside the ring with line breaks if needed
        const classLabelAngle = (startAngle + endAngle) / 2;
        const classLabelRadius = outerRadius + 70;
        const classLabelX = centerX + Math.cos(classLabelAngle) * classLabelRadius;
        const classLabelY = centerY + Math.sin(classLabelAngle) * classLabelRadius;

        // Split long class names into two lines
        const words = className.split(' ');
        let line1 = '';
        let line2 = '';

        if (words.length > 2 || className.length > 15) {
            // Split into two lines for long names
            const midPoint = Math.ceil(words.length / 2);
            line1 = words.slice(0, midPoint).join(' ');
            line2 = words.slice(midPoint).join(' ');
        } else {
            line1 = className;
        }

        // Fix class label orientation
        let classRotationAngle = (classLabelAngle * 180) / Math.PI;
        if (classRotationAngle > 90 && classRotationAngle < 270) {
            classRotationAngle += 180;
        }

        // Create text element for first line
        const classLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        classLabel1.setAttribute('x', classLabelX);
        classLabel1.setAttribute('y', line2 ? classLabelY - 7 : classLabelY);
        classLabel1.setAttribute('class', 'class-label');
        classLabel1.setAttribute('transform', `rotate(${classRotationAngle}, ${classLabelX}, ${classLabelY})`);
        classLabel1.textContent = line1;
        svgElement.appendChild(classLabel1);

        // Create text element for second line if needed
        if (line2) {
            const classLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            classLabel2.setAttribute('x', classLabelX);
            classLabel2.setAttribute('y', classLabelY + 7);
            classLabel2.setAttribute('class', 'class-label');
            classLabel2.setAttribute('transform', `rotate(${classRotationAngle}, ${classLabelX}, ${classLabelY})`);
            classLabel2.textContent = line2;
            svgElement.appendChild(classLabel2);
        }
    });
}

function createArcPath(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle) {
    const x1 = centerX + Math.cos(startAngle) * innerRadius;
    const y1 = centerY + Math.sin(startAngle) * innerRadius;
    const x2 = centerX + Math.cos(endAngle) * innerRadius;
    const y2 = centerY + Math.sin(endAngle) * innerRadius;
    const x3 = centerX + Math.cos(endAngle) * outerRadius;
    const y3 = centerY + Math.sin(endAngle) * outerRadius;
    const x4 = centerX + Math.cos(startAngle) * outerRadius;
    const y4 = centerY + Math.sin(startAngle) * outerRadius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return [
        `M ${x1} ${y1}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
    ].join(' ');
}

function toggleDrugSelection(drugName) {
    if (selectedMedications.includes(drugName)) {
        removeMedication(drugName);
    } else {
        selectedMedications.push(drugName);
        updateMedicationList();
        highlightDrugInRing(drugName);
        checkForInteractions();
    }
}

function highlightDrugInRing(drugName) {
    const drugElement = document.querySelector(`[data-drug="${drugName}"]`);
    if (drugElement) {
        drugElement.classList.add('selected');
        selectedDrugs.add(drugName);

        // Change color to active color
        const className = drugElement.getAttribute('data-class');
        drugElement.setAttribute('fill', drugData[className].activeColor);
    }
}

function unhighlightDrugInRing(drugName) {
    const drugElement = document.querySelector(`[data-drug="${drugName}"]`);
    if (drugElement) {
        drugElement.classList.remove('selected');
        selectedDrugs.delete(drugName);

        // Change color back to default
        const className = drugElement.getAttribute('data-class');
        drugElement.setAttribute('fill', drugData[className].defaultColor);
    }

    // Remove interaction lines for this drug
    const lines = document.querySelectorAll('.interaction-line');
    lines.forEach(line => {
        const drug1 = line.getAttribute('data-drug1');
        const drug2 = line.getAttribute('data-drug2');
        if (drug1 === drugName || drug2 === drugName) {
            line.remove();
        }
    });
}

async function checkForInteractions() {
    // Clear existing interaction lines
    const existingLines = document.querySelectorAll('.interaction-line');
    existingLines.forEach(line => line.remove());

    const interactionDetails = document.getElementById('interactionDetails');
    interactionDetails.innerHTML = '<div class="loading">Checking for interactions...</div>';

    if (selectedMedications.length < 2) {
        interactionDetails.innerHTML = '';
        return;
    }

    const foundInteractions = [];
    const promises = [];

    // Check all pairs of selected medications
    for (let i = 0; i < selectedMedications.length; i++) {
        for (let j = i + 1; j < selectedMedications.length; j++) {
            const drug1 = selectedMedications[i];
            const drug2 = selectedMedications[j];

            promises.push(checkDrugPairInteraction(drug1, drug2));
        }
    }

    try {
        const results = await Promise.all(promises);

        results.forEach(result => {
            if (result) {
                foundInteractions.push(result);
                drawInteractionLine(result.drug1, result.drug2);
            }
        });

        // Display interaction details
        displayInteractionResults(foundInteractions);

    } catch (error) {
        console.error('Error checking interactions:', error);
        interactionDetails.innerHTML = '<div class="error">Error checking interactions. Please try again.</div>';
    }
}

async function checkDrugPairInteraction(drug1, drug2) {
    // Try DrugBank API if configured (requires credentials)
    if (window.DRUGBANK_CONFIG && window.DRUGBANK_CONFIG.username !== 'YOUR_DRUGBANK_USERNAME') {
        const drugbankResult = await fetchDrugInteractions(drug1, drug2);
        if (drugbankResult) {
            return {
                drug1,
                drug2,
                ...drugbankResult
            };
        }
    }

    // Try OpenFDA API
    const fdaResult = await fetchOpenFDAInteraction(drug1, drug2);
    if (fdaResult) {
        return {
            drug1,
            drug2,
            ...fdaResult
        };
    }

    // Fallback to static database if APIs fail
    const interaction = await checkStaticInteractionDatabase(drug1, drug2);
    if (interaction) {
        return interaction;
    }

    return null;
}

// Enhanced interaction checking function
async function checkStaticInteractionDatabase(drug1Name, drug2Name) {
    // Normalize drug names
    const drug1 = drug1Name.trim();
    const drug2 = drug2Name.trim();

    // Check both directions
    const key1 = `${drug1}-${drug2}`;
    const key2 = `${drug2}-${drug1}`;

    if (drugInteractionDatabase[key1]) {
        return {
            drug1: drug1,
            drug2: drug2,
            severity: drugInteractionDatabase[key1].severity,
            effects: drugInteractionDatabase[key1].effects,
            mechanism: drugInteractionDatabase[key1].mechanism,
            management: drugInteractionDatabase[key1].management,
            source: 'Clinical Database'
        };
    }

    if (drugInteractionDatabase[key2]) {
        return {
            drug1: drug1,
            drug2: drug2,
            severity: drugInteractionDatabase[key2].severity,
            effects: drugInteractionDatabase[key2].effects,
            mechanism: drugInteractionDatabase[key2].mechanism,
            management: drugInteractionDatabase[key2].management,
            source: 'Clinical Database'
        };
    }

    return null;
}

function displayInteractionResults(foundInteractions) {
    const interactionDetails = document.getElementById('interactionDetails');

    if (foundInteractions.length > 0) {
        interactionDetails.innerHTML = '';
        foundInteractions.forEach(interaction => {
            const interactionDiv = document.createElement('div');
            interactionDiv.className = 'interaction-item';

            const sourceLabel = interaction.source === 'drugbank' ? ' (DrugBank)' :
                              interaction.source === 'openFDA' ? ' (FDA)' :
                              interaction.source === 'static' ? ' (Built-in)' : '';

            interactionDiv.innerHTML = `
                <div class="interaction-drugs">${interaction.drug1} ↔ ${interaction.drug2}${sourceLabel}</div>
                <div class="interaction-severity severity-${interaction.severity}">
                    ${interaction.severity.toUpperCase()} SEVERITY
                </div>
                <div class="interaction-effects">${interaction.effects}</div>
                ${interaction.mechanism ? `<div class="interaction-mechanism"><strong>Mechanism:</strong> ${interaction.mechanism}</div>` : ''}
                ${interaction.management ? `<div class="interaction-management"><strong>Management:</strong> ${interaction.management}</div>` : ''}
            `;
            interactionDetails.appendChild(interactionDiv);
        });
    } else {
        interactionDetails.innerHTML = '<p>No known interactions found between selected medications.</p>';
    }
}

function drawInteractionLine(drug1, drug2) {
    const drug1Element = document.querySelector(`[data-drug="${drug1}"]`);
    const drug2Element = document.querySelector(`[data-drug="${drug2}"]`);

    if (!drug1Element || !drug2Element) return;

    const centerX = 400;
    const centerY = 400;

    const innerRadius = 190;

    // Get positions on the inner circle edge
    const drug1Pos = getDrugPositionInner(drug1);
    const drug2Pos = getDrugPositionInner(drug2);

    if (drug1Pos && drug2Pos) {
        // Create curved path using quadratic bezier
        const controlRadius = innerRadius * 0.6;
        const midAngle = Math.atan2(
            (drug1Pos.y + drug2Pos.y) / 2 - centerY,
            (drug1Pos.x + drug2Pos.x) / 2 - centerX
        );
        const controlX = centerX + Math.cos(midAngle) * controlRadius;
        const controlY = centerY + Math.sin(midAngle) * controlRadius;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = `M ${drug1Pos.x} ${drug1Pos.y} Q ${controlX} ${controlY} ${drug2Pos.x} ${drug2Pos.y}`;
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'interaction-line');
        path.setAttribute('data-drug1', drug1);
        path.setAttribute('data-drug2', drug2);
        path.setAttribute('fill', 'none');
        svgElement.appendChild(path);
    }
}

function getDrugPositionInner(drugName) {
    const centerX = 400;
    const centerY = 400;
    const innerRadius = 180;

    // Find which class and position the drug is in
    for (const [className, classData] of Object.entries(drugData)) {
        const drugIndex = classData.drugs.indexOf(drugName);
        if (drugIndex !== -1) {
            const classIndex = Object.keys(drugData).indexOf(className);
            const classAngle = (2 * Math.PI) / Object.keys(drugData).length;
            const drugAngle = classAngle / classData.drugs.length;

            const startAngle = classIndex * classAngle - Math.PI / 2;
            const drugMidAngle = startAngle + (drugIndex + 0.5) * drugAngle;

            return {
                x: centerX + Math.cos(drugMidAngle) * innerRadius,
                y: centerY + Math.sin(drugMidAngle) * innerRadius
            };
        }
    }
    return null;
}

// Drug Popup Functions
function showDrugPopup(event, drugName) {
    const popup = document.getElementById('drugPopup');
    const drugInfo = drugInfoDatabase[drugName];

    if (!drugInfo) {
        // Fallback for drugs not in database
        document.getElementById('drugPopupTitle').textContent = drugName;
        document.getElementById('drugPopupMOA').textContent = 'Information not available';
        document.getElementById('drugPopupIndications').textContent = 'Information not available';
        document.getElementById('drugPopupDosing').textContent = 'Information not available';
        document.getElementById('drugPopupSideEffects').textContent = 'Information not available';
    } else {
        document.getElementById('drugPopupTitle').textContent = drugName;
        document.getElementById('drugPopupMOA').textContent = drugInfo.moa;
        document.getElementById('drugPopupIndications').textContent = drugInfo.indications;
        document.getElementById('drugPopupDosing').textContent = drugInfo.dosing;
        document.getElementById('drugPopupSideEffects').textContent = drugInfo.sideEffects;
    }

    // Position popup near mouse
    updatePopupPosition(event);
    popup.classList.add('visible');
}

function hideDrugPopup() {
    const popup = document.getElementById('drugPopup');
    popup.classList.remove('visible');
}

function updatePopupPosition(event) {
    const popup = document.getElementById('drugPopup');
    if (!popup.classList.contains('visible')) return;

    const rect = svgElement.getBoundingClientRect();
    const x = event.clientX - rect.left + 20;
    const y = event.clientY - rect.top - 10;

    // Ensure popup stays within bounds
    const popupRect = popup.getBoundingClientRect();
    const maxX = window.innerWidth - popupRect.width - 20;
    const maxY = window.innerHeight - popupRect.height - 20;

    popup.style.left = Math.min(x + rect.left, maxX) + 'px';
    popup.style.top = Math.min(y + rect.top, maxY) + 'px';
}

// Hover Effect Functions
function applyHoverEffect(drugElement, startAngle, endAngle) {
    const centerX = 400;
    const centerY = 400;
    const segmentMidAngle = (startAngle + endAngle) / 2;

    // Calculate the outward movement (10 pixels)
    const moveDistance = 10;
    const moveX = Math.cos(segmentMidAngle) * moveDistance;
    const moveY = Math.sin(segmentMidAngle) * moveDistance;

    // Apply scaling and translation
    const scale = 1.1;
    const transform = `translate(${moveX}, ${moveY}) scale(${scale})`;
    drugElement.style.transformOrigin = `${centerX}px ${centerY}px`;
    drugElement.style.transform = transform;
}

function removeHoverEffect(drugElement) {
    drugElement.style.transform = '';
    drugElement.style.transformOrigin = '';
}

function getDrugPosition(drugName) {
    const centerX = 400;
    const centerY = 400;
    const radius = 240; // Middle of inner and outer radius

    // Find which class and position the drug is in
    for (const [className, classData] of Object.entries(drugData)) {
        const drugIndex = classData.drugs.indexOf(drugName);
        if (drugIndex !== -1) {
            const classIndex = Object.keys(drugData).indexOf(className);
            const classAngle = (2 * Math.PI) / Object.keys(drugData).length;
            const drugAngle = classAngle / classData.drugs.length;

            const startAngle = classIndex * classAngle - Math.PI / 2;
            const drugStartAngle = startAngle + drugIndex * drugAngle;
            const drugEndAngle = startAngle + (drugIndex + 1) * drugAngle;
            const drugMidAngle = (drugStartAngle + drugEndAngle) / 2;

            return {
                x: centerX + Math.cos(drugMidAngle) * radius,
                y: centerY + Math.sin(drugMidAngle) * radius
            };
        }
    }
    return null;
}

