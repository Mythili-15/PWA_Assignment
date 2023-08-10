import nltk
import json
from nltk.util import ngrams
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

nltk.download('punkt') 

@csrf_exempt
def process_ngrams(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))['strings']  
        print('Received Data:', data) 
        ngram_results = []
        n = 2  # Set n as 2 for bigram comparison
        for i in range(len(data) - 1):
            ngram_data = []
            similarities = []
            for j in range(i + 1, len(data)):
                tokens1 = nltk.word_tokenize(data[i])
                tokens2 = nltk.word_tokenize(data[j])
                ngram_set1 = set(ngrams(tokens1, n))
                ngram_set2 = set(ngrams(tokens2, n))
                common_ngrams = ngram_set1 & ngram_set2
                similarity = len(common_ngrams) / max(len(ngram_set1), len(ngram_set2))
                similarities.append(similarity)
                ngram_data.append({
                    'ngram_set1': [ngram_str(ngram) for ngram in ngram_set1],
                    'ngram_set2': [ngram_str(ngram) for ngram in ngram_set2],
                    'common_ngrams': [ngram_str(ngram) for ngram in common_ngrams]
                })
            ngram_results.append({
                'similarities': similarities,
                'ngram_data': ngram_data
            })
        
        return JsonResponse({'ngram_results': ngram_results})

def ngram_str(ngram):
    return ' '.join(ngram)
