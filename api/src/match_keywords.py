from blooms_levels import BLOOMS_TAXONOMY

def match_verbs_to_blooms(verbs):
    """
    Matches extracted verbs to Bloom's Taxonomy levels.

    Inputs
    ------
    verbs : list of strings containing extracted verbs.

    Outputs
    -------
    matched_levels : dict where keys are Bloom's Taxonomy levels and values are lists of matched verbs.
    """
    matched_levels = {level: [] for level in BLOOMS_TAXONOMY}

    for verb in verbs:
        for level, keywords in BLOOMS_TAXONOMY.items():
            if verb in keywords:
                matched_levels[level].append(verb)
                break  # Stop searching once the verb is matched to a level

    return matched_levels