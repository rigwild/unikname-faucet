printf "Tokens left: "
curl http://localhost:8080/tokensLeft
printf "\nTotal gifted tokens: "
curl http://localhost:8080/giftedTokensTotal


printf "\n\n"

printf "\nAsk for tokens 1:\n"
curl -X POST http://localhost:8080/gift?walletAddress=SexFWny6MMBt6AnUqeJb5C1LJQXvN89cmA

printf "\n\n"

printf "\nAsk for tokens 2:\n"
curl -X POST http://localhost:8080/gift?walletAddress=SexFWny6MMBt6AnUqeJb5C1LJQXvN89cmA

printf "\n\n"

printf "\nTokens left: "
curl http://localhost:8080/tokensLeft
printf "\nTotal gifted tokens: "
curl http://localhost:8080/giftedTokensTotal
