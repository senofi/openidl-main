INPUT_FILE_NAME = 'test/data/BPPremData1000.txt'
OUTPUT_FILE_NAME = 'testData.json'

test_ready:
	npx mocha -g Ready

generate_data:
	node generateSampleData.js ${INPUT_FILE_NAME} ${OUTPUT_FILE_NAME}