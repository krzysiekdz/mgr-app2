katalog nadrz�dny (mgr-main) : https://github.com/krzysiekdz/mgr-main

App2.
Aplikacj� nalezy uruchomi�, gdy zbierzemy ju� potrzebne wykresy czasowe w folderze traces (przy uzyciu app1). 
App2 wczytuje wszystkie utworzone w folderze traces logi (wykresy), przetwarza je ( filtruje  tzn obcina 
niepotrzebne dane, konwertuje na postac wygodna do obliczen ) i oblicza srednie czasy trwania poszczegolnych 
operacji, podsumowuje je, por�wnuje z czasami trwania operacji w czystym javascript. Wyniki s� zapisywane do 
pliku results.json w katalogu app3 (trafi� do app3 odpowiedzialnej za prezentacj� wynik�w).

uruchamianie (w katalgou nadrzednym, musi byc te� w tym katalogu dostepny folder traces)
node app2/trace-processor.js 

konfiguracja:
cfg.js REJECT_COUNT - ile najgorszych wynik�w odrzuca� (pozostla do dopisania druga mozliwosc - ile najlepszych pobierac)

rezultat dzialania:
plik app3/results.json - plik z wynikami ktore nalezy odpowiednio zaprezentowa�