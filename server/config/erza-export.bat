cd C:/Program Files/MongoDB/Server/3.2/bin

set db=erza-production
set scriptpath=%~dp0
set path=%scriptpath%data\

mongoexport /d %db% /c animes /o %path%anime.txt
mongoexport /d %db% /c mangas /o %path%manga.txt
mongoexport /d %db% /c episodes /o %path%episode.txt
mongoexport /d %db% /c chapters /o %path%chapter.txt
mongoexport /d %db% /c tags /o %path%tag.txt

cd %scriptpath%