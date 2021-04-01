#!/usr/bin/env bash
source config_image_var.sh
set -e
cd "$(dirname "$0")"
IMPORT_EXPORT_REQUIRED=0
function usage {
    echo "Usage: join_network.sh [-i] [join|destroy]" 1>&2
    exit 1
}
while getopts ":i" OPT; do
    case ${OPT} in
        i)
            IMPORT_EXPORT_REQUIRED=1
            ;;
        \?)
            usage
            ;;
    esac
done
shift $((OPTIND -1))
COMMAND=$1
if [ "${COMMAND}" = "join" ]; then
    if [ "$NODE_NAME" == "analytics" ]
    then
        set -x
        ansible-playbook 01-create-ordering-organization-components.yml
        ansible-playbook 02-create-endorsing-organization-components.yml

        ansible-playbook 11-create-endorsing-organization-components.yml
        if [ "${IMPORT_EXPORT_REQUIRED}" = "1" ]; then
            ansible-playbook 12-export-organization.yml
            ansible-playbook 13-import-organization.yml
        fi
        ansible-playbook 14-add-organization-to-channel.yml

        SEARCHVAR=$NODE_NAME"msp"
        echo $SEARCHVAR
        if grep -q "$SEARCHVAR" original_config.bin
        then
            # code if found
            echo "Not running 14sub"
        else
            # code if not found
            echo "Running 14sub"
            ansible-playbook 14-sub-add-organization-to-channel.yml
        fi
        

        ansible-playbook 14a-add-organization-to-channel.yml
        if grep -q "$SEARCHVAR" original_config.bin
        then
            # code if found
            echo "Not running 14a-sub"
        else
            # code if not found
            echo "Running 14a-sub"
            ansible-playbook 14a-sub-add-organization-to-channel.yml
        fi
        

        if [ "${IMPORT_EXPORT_REQUIRED}" = "1" ]; then
            ansible-playbook 06-export-ordering-service.yml
            ansible-playbook 15-import-ordering-service.yml
        fi
        ansible-playbook 16-join-peer-to-channel.yml
        ansible-playbook 16a-join-peer-to-channel.yml
        ansible-playbook 17-add-anchor-peer-to-channel.yml
        ansible-playbook 17a-add-anchor-peer-to-channel.yml

        ansible-playbook 19-install-chaincode.yml
        
        ansible-playbook 21b-download-connectionprofile.yml
    else
        set -x
        ansible-playbook 01-create-ordering-organization-components.yml
        ansible-playbook 02-create-endorsing-organization-components.yml

        ansible-playbook 02a-create-endorsing-organization-components.yml

        ansible-playbook 11-create-endorsing-organization-components.yml
        if [ "${IMPORT_EXPORT_REQUIRED}" = "1" ]; then
            ansible-playbook 12-export-organization.yml
            ansible-playbook 13-import-organization.yml
        fi

        ansible-playbook 05a-add-organization-to-consortium.yml
        SEARCHVAR=$NODE_NAME"msp"
        echo $SEARCHVAR
        if grep -q "$SEARCHVAR" original_config.bin
        then
            # code if found
            echo "Not running 5a"
        else
            # code if not found
            echo "Running 5a"
            ansible-playbook 05a-sub-add-organization-to-consortium.yml
        fi

        ansible-playbook 14-add-carrier-to-defaultchannel.yml

        SEARCHVAR=$NODE_NAME"msp"
        echo $SEARCHVAR
        if grep -q "$SEARCHVAR" original_config.bin
        then
            # code if found
            echo "Not running 14 sub carrier"
        else
            # code if not found
            echo "Running 14sub carrier"
            ansible-playbook 14-sub-add-carrier-to-defaultchannel.yml
        fi

        if [ "${IMPORT_EXPORT_REQUIRED}" = "1" ]; then
            ansible-playbook 06-export-ordering-service.yml
            ansible-playbook 15-import-ordering-service.yml
        fi

        ansible-playbook 16-join-peer-to-channel.yml
        #ansible-playbook 16a-join-peer-to-channel.yml
        ansible-playbook 17-add-anchor-peer-to-channel.yml
        #ansible-playbook 17a-add-anchor-peer-to-channel.yml

        ansible-playbook 12b-export-organization.yml
        ansible-playbook 13b-import-organization.yml

        #For carrier channel
        ansible-playbook 08b-create-channel.yml
        ansible-playbook 09b-join-peer-to-channel.yml
        ansible-playbook 10b-add-anchor-peer-to-channel.yml

        
        ansible-playbook 14b-add-organization-to-channel.yml
        SEARCHVAR="analyticsmsp"
        echo $SEARCHVAR
        if grep -q "$SEARCHVAR" original_config.bin
        then
            # code if found
            echo "Not running 14sub"
        else
            # code if not found
            echo "Running 14sub"
            ansible-playbook 14b-sub-add-organization-to-channel.yml
        fi

        ansible-playbook 16b-join-peer-to-channel.yml
        ansible-playbook 17b-add-anchor-peer-to-channel.yml

        ansible-playbook 19-install-chaincode.yml
        
        ansible-playbook 21b-download-connectionprofile.yml

    fi
        set +x
elif [ "${COMMAND}" = "destroy" ]; then
    set -x
    if [ "${IMPORT_EXPORT_REQUIRED}" = "1" ]; then
        ansible-playbook 97-delete-endorsing-organization-components.yml --extra-vars '{"import_export_used":true}'
        ansible-playbook 98-delete-endorsing-organization-components.yml --extra-vars '{"import_export_used":true}'
        ansible-playbook 99-delete-ordering-organization-components.yml --extra-vars '{"import_export_used":true}'
    else
        ansible-playbook 97-delete-endorsing-organization-components.yml
        ansible-playbook 98-delete-endorsing-organization-components.yml
        ansible-playbook 99-delete-ordering-organization-components.yml
    fi
    set +x
else
    usage
fi