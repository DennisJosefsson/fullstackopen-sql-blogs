CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
author text,
url text NOT NULL,
title text NOT NULL,
likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Tommy Suwunrut', 'https://medium.com/rbi-tech/tips-and-tricks-for-working-with-apollo-cache-3b5a757f10a0','Tips and Tricks for working with Apollo Cache');
insert into blogs (author, url, title) values ('Miao Bin', 'https://medium.com/nerd-for-tech/graph-traversal-in-python-bfs-dfs-dijkstra-a-star-parallel-comparision-dd4132ec323a','Graph Traversal in Python: BFS,DFS,Dijkstra,A-star parallel comparision');