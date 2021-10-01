echo 'Copying config files to openidl-secrets'
cp -R ./config/config-local-aais ../openidl-k8s/charts/openidl-secrets/
cp -R ./config/config-local-aanalytics ../openidl-k8s/charts/openidl-secrets/
cp -R ./config/config-local-carrier ../openidl-k8s/charts/openidl-secrets/
echo 'Done'