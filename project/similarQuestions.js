const DEFAULT_LIMIT = 3;
const IGNORED_WORDS = new Set([
	"a",
	"an",
	"and",
	"can",
	"how",
	"i",
	"is",
	"of",
	"the",
	"to",
	"what",
]);

function tokenize(value = "") {
	const words = String(value).toLowerCase().match(/[a-z0-9]+/g) || [];
	return new Set(words.filter((word) => word.length > 1 && !IGNORED_WORDS.has(word)));
}

function scoreSimilarity(query, candidate) {
	const queryWords = tokenize(query);
	const candidateWords = tokenize(candidate);

	if (queryWords.size === 0 || candidateWords.size === 0) {
		return 0;
	}

	const sharedWords = [...queryWords].filter((word) => candidateWords.has(word)).length;
	const uniqueWords = new Set([...queryWords, ...candidateWords]).size;
	return sharedWords / uniqueWords;
}

function findSimilarQuestions(query, questions, limit = DEFAULT_LIMIT) {
	if (!Array.isArray(questions)) {
		throw new TypeError("questions must be an array");
	}

	const resultLimit = Number.isFinite(limit)
		? Math.max(0, Math.floor(limit))
		: DEFAULT_LIMIT;

	return questions
		.map((question) => ({
			...question,
			similarity: Number(
				scoreSimilarity(query, question.title || question.question || "").toFixed(3),
			),
		}))
		.filter((question) => question.similarity > 0)
		.sort((left, right) => (
			right.similarity - left.similarity || (right.votes || 0) - (left.votes || 0)
		))
		.slice(0, resultLimit);
}

module.exports = {
	findSimilarQuestions,
	scoreSimilarity,
};
