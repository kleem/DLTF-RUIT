The ability to load `neo4j` graphs has been introduced. In particular the [*Bitcoin's payments graph*](https://drive.google.com/file/d/1G6HcLj-KEn1Rv4i_jY5ct27DScYek6n_/view?usp=drive_link) archive can be downloaded and extracted in the subfolder `neo4j`. 

Then the system has been defined by a Docker composition of services such that:
- a *web interface* provides at http://localhost:8800/neo4j/browser/ a way to explore the raw neo4j graph;
- a *REST interface* provides at http://localhost:8800/neo4j/db/paymentsgraph/tx/commit a way to programmatically retrieve data from the service;
- another *web interface* provides at http://localhost:8800/ the entry point for exploring graphs coded via the `Webgraph` framework, allowing the user: 
    - to choose different visit strategies (BFS, DFS)
    - to visualize dynamically and asynchrounously a growing subgraph, stopping and restarting the population of vertices and edges as desired;
    - to layout the current subgraph via `graphviz`'s algorithms, loaded as a *WebAssembly* module for the sake of efficiency.