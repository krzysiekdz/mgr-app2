katalog nadrzêdny (mgr-main) : https://github.com/krzysiekdz/mgr-main

App2.
Aplikacjê nalezy uruchomiæ, gdy zbierzemy ju¿ potrzebne wykresy czasowe w folderze traces (przy uzyciu app1). 
App2 wczytuje wszystkie utworzone w folderze traces logi (wykresy), przetwarza je ( filtruje  tzn obcina 
niepotrzebne dane, konwertuje na postac wygodna do obliczen ) i oblicza srednie czasy trwania poszczegolnych 
operacji, podsumowuje je, porównuje z czasami trwania operacji w czystym javascript. Wyniki s¹ zapisywane do 
pliku results.json w katalogu app3 (trafi¹ do app3 odpowiedzialnej za prezentacjê wyników).

uruchamianie (w katalgou nadrzednym, musi byc te¿ w tym katalogu dostepny folder traces)
node app2/trace-processor.js 

konfiguracja:
cfg.js REJECT_COUNT - ile najgorszych wyników odrzucaæ (pozostla do dopisania druga mozliwosc - ile najlepszych pobierac)

rezultat dzialania:
plik app3/results.json - plik z wynikami ktore nalezy odpowiednio zaprezentowaæ