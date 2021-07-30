echo "# # # # # #   B u i l d i n g   ( openidl/ui )  D o c k e r  I m a g e  # # # # # #"
rm -rf node_modules

echo "=====> copy openidl-common-ui."
cp -R ../openidl-common-ui openidl-common-ui 

docker build -t openidl/ui .

echo "=====> delete openidl-common-ui"
rm -rf openidl-common-ui 
