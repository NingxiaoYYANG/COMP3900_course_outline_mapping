import os
import nltk

# Check if NLTK data is already downloaded
nltk_data_path = os.path.expanduser('~') + '/nltk_data'
if not os.path.exists(nltk_data_path + '/tokenizers/punkt'):
    nltk.download('punkt', download_dir=nltk_data_path)
if not os.path.exists(nltk_data_path + '/taggers/averaged_perceptron_tagger'):
    nltk.download('averaged_perceptron_tagger', download_dir=nltk_data_path)
