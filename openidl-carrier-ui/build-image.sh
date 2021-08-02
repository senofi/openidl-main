echo "# # # # # #   B u i l d i n g   ( openidl/ui )  D o c k e r  I m a g e  # # # # # #"
rm -rf node_modules

echo "=====> copy openidl-common-ui."
cp -R ../openidl-common-ui openidl-common-ui 

echo "=====> copy .npmrc from home directory."
cp ~/.npmrc npmrc

docker build -t openidl/carrier-ui .

echo "=====> delete openidl-common-ui"
rm -rf openidl-common-ui 

echo "=====> delete npmrc"
rm -rf npmrc
