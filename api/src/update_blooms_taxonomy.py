import os
import ast

def update_blooms_taxonomy(new_entries):
    # Get the absolute path to the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Current directory: {current_dir}")

    # Construct the absolute path to the blooms_levels.py file
    file_path = os.path.join(current_dir, 'blooms_levels.py')
    print(f"File path: {file_path}")

    try:
        # Read the file content
        with open(file_path, 'r') as file:
            lines = file.readlines()
        print("File read successfully.")
    except FileNotFoundError:
        print(f"FileNotFoundError: The file at path {file_path} does not exist.")
        return
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return

    # Find the line with the BLOOMS_TAXONOMY dictionary
    start_line = 0
    for i, line in enumerate(lines):
        if line.startswith("BLOOMS_TAXONOMY ="):
            start_line = i
            break
    else:
        print("BLOOMS_TAXONOMY dictionary definition not found in the file.")
        return

    print(f"BLOOMS_TAXONOMY found at line {start_line}.")

    # Extract the dictionary as a string
    dictionary_str = ''.join(lines[start_line:])
    try:
        blooms_taxonomy = ast.literal_eval(dictionary_str.split('=', 1)[1].strip())
        print("Dictionary parsed successfully.")
    except Exception as e:
        print(f"An error occurred while parsing the dictionary: {e}")
        return

    # Modify the dictionary as needed
    for level, examples in new_entries.items():
        for example in examples:
            if example not in blooms_taxonomy[level]:
                blooms_taxonomy[level].append(example)

    # Convert the dictionary back to a string
    new_dictionary_str = "BLOOMS_TAXONOMY = " + str(blooms_taxonomy)

    # Replace the old dictionary string with the new one in the lines
    lines[start_line:] = [new_dictionary_str]

    try:
        # Write the updated content back to the file
        with open(file_path, 'w') as file:
            file.writelines(lines)
        print("File written successfully.")
    except Exception as e:
        print(f"An error occurred while writing to the file: {e}")

    print("BLOOMS_TAXONOMY dictionary updated successfully!")