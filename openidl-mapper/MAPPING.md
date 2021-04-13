# Mapping the Stat Plans to the HDS format

- the mappings are described in the different modules
- HDSProcessor handles all the general mappings
- BOProcessor, IMProcessor, CPProcessor all describe specifics for that line of business
- the mapping object contains all the functions used to do the mapping, the key is then used during the convertion to set the specific values
- the reference data file is used to hold all lookup information


