#!/bin/zsh

# Clean up old images
echo "Removing old plo ts..."
rm -f ./output/img/*.*

# ============================================================================
# Input Files Configuration
# ============================================================================
#file1="output/DAO-UniformProposal-DynamicVote_t1209600_aggr3600_20250701162521.tsv"
##file2="output/DAO-UniformProposal-GartnerVote_t1209600_aggr3600_20250628161537.tsv"
#file2="output/DAO-UniformProposal-normal_t1209600_aggr3600_20250701182806.tsv"
#file3="output/2peakUser_t1209600_aggr3600_20250628163123.tsv"
#file3="output/DAO-TwoPeaks-UserVoteDynamic_t1209600_aggr3600_20250701191815.tsv"
#file4="output/DAO-2PeakUsers-and-Proposal_t1209600_aggr3600_20250629163944.tsv"
#file5="output/DAO-peakOnProposal_t1209600_aggr3600_20250629085958.tsv"
#file6="output/DAO-UniformProposal-DynamicVote_t1209600_aggr3600_20250701154032.tsv"


file1="output/DAO-Uniform_t1209600_aggr3600_20250701200031.tsv"
file2="output/DAO-Uniform_GartnerVote_t1209600_aggr3600_20250701200722.tsv"
file3="output/DAO-TwoPeaks-GartenerVote_t1209600_aggr3600_20250701201757.tsv"
file4="output/DAO-2PeakUsers-and-Proposal_t1209600_aggr3600_20250701202615.tsv"
file5="output/5.DAO-peakOnProposal_t1209600_aggr3600_20250702070708.tsv"
file6="output/6.DAO-UserBassModel_t1209600_aggr3600_20250701210130.tsv"

sim1="1. Uniform"
sim2="2. Uniform and Gartner Vote"
sim3="3. Two Peaks User"
sim4="4. Two Peak Users and Proposal"
sim5="5. Peak On Proposal"
sim6="6. User bass model"

#sim1="1"
#sim2="2"
#sim3="3"
#sim4="4"
#sim5="5"
#sim6="6"

#color1="green" #2ca02c
#color2="red" #d62728
#color3="purple" #9467bd
#color4="brown" #8B4513
#color5="blue" #1f77b4
#color6="orange"#ff7f0e

color1="#2ca02c"
color2="#d62728"
color3="#9467bd"
color4="#8B4513"
color5="#1f77b4"
color6="#ff7f0e"

# Check if files exist
for f in $file1 $file2 $file3 $file4 $file5 $file6; do
    if [[ ! -f "$f" ]]; then
        echo "Error: Input file $f not found"
        exit 1
    fi
done

# Create output/img directory
mkdir -p output/img

# ============================================================================
# Common Gnuplot Settings
# ============================================================================
common_settings="
set terminal png size 1600,1000 enhanced
set grid ytics lt 1 lc rgb '#dddddd' lw 1
set grid xtics lt 1 lc rgb '#dddddd' lw 1
set xrange [0:1209600]
set yrange [0:*]
set key outside right center vertical box width 2
set border 3 lw 2
set style fill transparent solid 0.2

# Time axis formatting (convert seconds to days)
set xtics ('0' 0, '2d' 172800, '4d' 345600, '6d' 518400, '8d' 691200, '10d' 864000, '12d' 1036800, '14d' 1209600)

# Font settings
set xtics font 'Times-New-Roman,12'
set ytics font 'Times-New-Roman,12'
set xlabel font 'Times-New-Roman,14'
set ylabel font 'Times-New-Roman,14'
set title font 'Times-New-Roman,16' noenhanced
set key font 'Times-New-Roman,11'
set xlabel 'Time (days)'

# Add minor gridlines
set mxtics 2
set mytics 2
set grid mxtics mytics lt 1 lc rgb '#eeeeee' lw 0.5
"

common_clean_settings="
set terminal pngcairo enhanced size 1200,800 font 'DejaVu Sans,15'

# Clean minimal settings
set grid xtics ytics lt 1 lc rgb '#e0e0e0' lw 1
set border 3 lw 2
set key top left box opaque font 'DejaVu Sans,13'
set xtics ('0' 0, '2d' 172800, '4d' 345600, '6d' 518400, '8d' 691200, '10d' 864000, '12d' 1036800, '14d' 1209600)
set yrange [0:*]
"

# ============================================================================
# Plot Average Users
# ============================================================================
gnuplot << EOF
set output './output/img/dao_comparison_AvgUsers_trend.png'
set title 'Average Users Comparison'
set ylabel 'Average Number of Users'
$common_clean_settings

plot '$file1' using 1:27 smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:27 smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:27 smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:27 smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:27 smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:27 smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF

# ============================================================================
# Plot Average Proposals
# ============================================================================
gnuplot << EOF
set output './output/img/dao_comparison_AvgProposals_trend.png'
set title 'Average Proposals Comparison'
set ylabel 'Average Number of Proposals'
$common_clean_settings
set key at screen 0.5,0.8 box opaque font 'DejaVu Sans,13'

plot '$file1' using 1:17 smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:17 smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:17 smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:17 smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:17 smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:17 smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF

# ============================================================================
# Plot Average Votes
# ============================================================================
gnuplot << EOF
set output './output/img/dao_comparison_AvgVotes_trend.png'
set title 'Average Votes Comparison'
set ylabel 'Average Number of Votes'
$common_clean_settings

plot '$file1' using 1:22 smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:22 smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:22 smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:22 smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:22 smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:22 smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF

# ============================================================================
# Plot Average Votes Per Run - LOG SCALE VERSION (for better readability)
# Linee parallele = tassi di crescita simili
# Linee che si allontanano = una simulazione accelera più dell'altra
# Curve ripide = crescita esponenziale rapida
# Curve piatte = crescita lenta o plateau
# ============================================================================
gnuplot << EOF
set output './output/img/dao_comparison_AvgVotesPerRun_log.png'
set title 'Average Votes Comparison (Log Scale)'
set ylabel 'Average Number of Votes (Log Scale)'
set logscale y
set bars 2.0
$common_clean_settings
set key at screen 0.95, 0.05 right bottom box opaque font 'DejaVu Sans,13'
set format y "10^{%T}"

# Plot with lines only for log scale
plot '$file1' using 1:22 smooth bezier with lines lw 3 lc rgb '$color1' title '$sim1', \
     '$file2' using 1:22 smooth bezier with lines lw 3 lc rgb '$color2' title '$sim2', \
     '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '$color3' title '$sim3', \
     '$file4' using 1:22 smooth bezier with lines lw 3 lc rgb '$color4' title '$sim4', \
     '$file5' using 1:22 smooth bezier with lines lw 3 lc rgb '$color5' title '$sim5', \
     '$file6' using 1:22 smooth bezier with lines lw 3 lc rgb '$color6' title '$sim6'
EOF

#
## ============================================================================
## Plot Average Proposals with Error Bars
## ============================================================================
#gnuplot << EOF
#$common_settings
#set output './output/img/dao_comparison_AvgProposalsPerRun.png'
#set title 'Average Proposals with Errors'
#set ylabel 'Average Number of Proposals'
#set bars 4.0
#
## Plot filled curves with error bars
#plot '$file1' using 1:17 smooth bezier with lines lw 3 lc rgb '#228B22' title 'Uniform Proposal Dynamic Vote', \
#     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#228B22' notitle, \
#     '$file2' using 1:17 smooth bezier with lines lw 3 lc rgb '#FF8C00' title 'Uniform Proposal Gartner Vote', \
#     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#FF8C00' notitle, \
#     '$file3' using 1:17 smooth bezier with lines lw 3 lc rgb '#9370DB' title 'Two Peaks User Vote Dynamic', \
#     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#9370DB' notitle, \
#     '$file4' using 1:17 smooth bezier with lines lw 3 lc rgb '#DC143C' title '2 Peak Users and Proposal', \
#     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#DC143C' notitle, \
#     '$file5' using 1:17 smooth bezier with lines lw 3 lc rgb '#8B4513' title 'Peak On Proposal', \
#     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#8B4513' notitle
#EOF


#
### ============================================================================
### Plot Average Votes Per Run - MULTI-PANEL VERSION
### ============================================================================
##gnuplot << EOF
##$common_settings
##set output './output/img/dao_comparison_AvgVotesPerRun_multipanel.png'
##set multiplot layout 2,1 title 'Average Votes Per Run - Multi-Panel View' font 'Times-New-Roman,18'
##
### Top panel - High performers
##set title 'High Vote Activity Scenarios' font 'Times-New-Roman,14'
##set ylabel 'Votes per Run' font 'Times-New-Roman,12'
##set yrange [0:150000]
##set key outside right center vertical box width 1.5
##set key font 'Times-New-Roman,9'
##
##plot '$file1' using 1:22 smooth bezier with lines lw 3 lc rgb '#1f77b4' title 'Uniform Dynamic', \
##     '$file2' using 1:22 smooth bezier with lines lw 3 lc rgb '#ff7f0e' title 'Uniform Gartner'
##
### Bottom panel - Lower performers
##set title 'Moderate Vote Activity Scenarios' font 'Times-New-Roman,14'
##set ylabel 'Votes per Run' font 'Times-New-Roman,12'
##set xlabel 'Time (days)' font 'Times-New-Roman,12'
##set yrange [0:20000]
##
##plot '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
##     '$file4' using 1:22 smooth bezier with lines lw 3 lc rgb '#d62728' title '2 Peak Users+Prop', \
##     '$file5' using 1:22 smooth bezier with lines lw 3 lc rgb '#9467bd' title 'Peak Proposal'
##
##unset multiplot
##EOF
#
### ============================================================================
### Plot Average Votes Per Run - ANNOTATED VERSION (with key insights)
### ============================================================================
##gnuplot << EOF
##$common_settings
##set output './output/img/dao_comparison_AvgVotesPerRun_annotated.png'
##set title 'Average Votes Per Run - Key Insights Highlighted'
##set ylabel 'Average Number of Votes per Run'
##set bars 2.0
##
### Settings for annotated version
##set key outside right center vertical box width 1.8
##set key font 'Times-New-Roman,9'
##
### Add annotations for key points
##set label 1 "Peak Activity" at 345600,120000 font 'Times-New-Roman,10' tc rgb 'red'
##set arrow 1 from 345600,115000 to 345600,130000 lc rgb 'red' lw 2
##
##set label 2 "Growth Phase" at 172800,50000 font 'Times-New-Roman,10' tc rgb 'blue'
##set arrow 2 from 172800,45000 to 259200,70000 lc rgb 'blue' lw 1
##
##set label 3 "Plateau" at 864000,15000 font 'Times-New-Roman,10' tc rgb 'green'
##
### Plot with enhanced visibility
##plot '$file1' using 1:22 smooth bezier with lines lw 4 lc rgb '#1f77b4' title 'Uniform Dynamic (Best)', \
##     '$file2' using 1:22 smooth bezier with lines lw 4 lc rgb '#ff7f0e' title 'Uniform Gartner (Good)', \
##     '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
##     '$file4' using 1:22 smooth bezier with lines lw 2 lc rgb '#d62728' title '2 Peak Users+Prop', \
##     '$file5' using 1:22 smooth bezier with lines lw 2 lc rgb '#9467bd' title 'Peak Proposal'
##EOF


# ============================================================================
# Plot Vote-to-Proposal Ratio (Engagement Efficiency)
# Cosa misura (Engagement Efficiency):
# Efficacia dell'engagement - Quanto "attraggono" le proposte:
# Valore alto (es. 50 voti/proposta): Le proposte generano molto interesse
# Valore basso (es. 5 voti/proposta): Le proposte ricevono poco engagement
# Interpretazione dei valori:
# Ratio	Significato
# 100+ Proposte molto coinvolgenti - Grande partecipazione
# 80-99	Proposte attraenti - Partecipazione moderata
# 5-20	Engagement moderato - Partecipazione limitata
# <5	Basso engagement - Proposte poco attraenti
# Linee in alto: Simulazioni con alta efficienza (proposte di qualità)
# Linee in basso: Simulazioni con bassa efficienza (troppo rumore)
# Trend crescente: Il sistema migliora nel tempo
# Volatilità: Indica instabilità nell'engagement
# ============================================================================
gnuplot << EOF
$common_clean_settings
set output './output/img/dao_comparison_VoteProposalRatio.png'
set title 'Vote-to-Proposal Ratio (Engagement Efficiency)'
set ylabel 'Votes per Proposal'

# Add check to avoid division by zero
plot '$file1' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:(\$17>0 ? \$22/\$17 : 0) smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF


# ============================================================================
# Plot User Participation Rate (Votes per User)
# Formula: Voti ÷ Utenti = Voti per Utente
# Cosa misura (User Participation Rate):
# Livello di attività individuale - Quanto è attivo ogni singolo utente:
# Valore alto (es. 15 voti/utente): Utenti molto attivi, partecipano spesso
# Valore basso (es. 2 voti/utente): Utenti passivi, partecipano poco
#
# Interpretazione dei valori:
# Voti/Utente	Significato
# 10+	 Utenti super attivi - Community molto coinvolta
# 5-10	Buona partecipazione - Utenti regolarmente attivi
# 2-5	Partecipazione moderata - Solo alcuni utenti attivi
# <2	Bassa partecipazione - Molti utenti passivi/lurkers
#
# Cosa rivela della community:
# Engagement individuale:
#
#  Alto = Ogni utente vota spesso, community coinvolta
# Basso = Molti utenti "dormono", solo pochi partecipano
#
# Tipologia di community:
# Alta partecipazione = Community attiva, democratica
# Bassa partecipazione = Community passiva, oligarchia
#
# Evoluzione nel tempo:
# Crescente = Gli utenti si stanno abituando, aumenta il coinvolgimento
# Decrescente = Burn-out, perdita di interesse
#
# Nel grafico vedrai:
# Linee in alto: Simulazioni con utenti molto attivi
# Linee in basso: Simulazioni con molti utenti passivi
#
# Trend crescente: Gli utenti diventano più coinvolti
#
# Plateau: Livello di partecipazione stabilizzato
#
# Perché è cruciale:
# Misura la democraticità: Un DAO sano ha alta partecipazione
# Detect centralizzazione: Bassa partecipazione = pochi decidono per tutti
# ============================================================================
gnuplot << EOF
$common_clean_settings
set output './output/img/dao_comparison_UserParticipation.png'
set title 'User Participation Rate (Votes per User)'
set ylabel 'Average Votes per User'

# Add check to avoid division by zero
plot '$file1' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:(\$27>0 ? \$22/\$27 : 0) smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF



# ============================================================================
# Plot Proposal Creation Rate (Proposals per User)
# Formula: Proposte ÷ Utenti = Proposte per Utente
# Cosa misura (Proposal Creation Rate):
#Proattività degli utenti - Quanto proposte creano gli utenti:
# Valore alto (es. 0.5 proposte/utente): Metà degli utenti crea proposte
# Valore basso (es. 0.05 proposte/utente): Solo 1 utente su 20 propone
# Interpretazione dei valori:

# Proposte/Utente	Significato
#0.3+	Community molto creativa - Molti utenti propongono
#0.1-0.3	Buona creatività - Discreta partecipazione attiva
#0.05-0.1	Creatività limitata - Pochi utenti proattivi
#<0.05	Community passiva - Solo 1-2% propone

#Evoluzione della Proattività:
#Crescente = Gli utenti diventano più fiduciosi nel proporre
#Stabile = Equilibrio tra proposers e voters


#Linee in alto: Simulazioni che incoraggiano la propositività
#Linee in basso: Simulazioni dove pochi utenti osano proporre

#Picchi: Momenti di alta creatività/fiducia
#Valleys: Periodi di incertezza o saturazione di idee
# ============================================================================
gnuplot << EOF
$common_clean_settings
set output './output/img/dao_comparison_ProposalRate.png'
set title 'Proposal Creation Rate (Proposals per User)'
set ylabel 'Proposals per User'
set key at screen 0.5,0.8 box opaque font 'DejaVu Sans,13'

# Add check to avoid division by zero
plot '$file1' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color1' title '$sim1', \
     '$file2' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color2' title '$sim2', \
     '$file3' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
     '$file4' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
     '$file5' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
     '$file6' using 1:(\$27>0 ? \$17/\$27 : 0) smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF

# ============================================================================
# Plot Cumulative Performance Comparison
# Formula: Users + Proposals*10 + Votes/100 = Punteggio Composito
# Cosa misura (Cumulative Performance):
# Performance complessiva del DAO - Bilancia tutti gli aspetti dell'attività:
# Componenti del punteggio:
# - Utenti (peso 1x): Base della community
# - Proposte (peso 10x): Creatività/leadership (peso alto perché rare e preziose)
# - Voti (peso 0.01x): Engagement generale (peso basso perché numerosi)
#
# Interpretazione dei valori:
# Punteggio Alto: DAO ben bilanciato con molti utenti, buone proposte, alta partecipazione
# Punteggio Basso: DAO sbilanciato o con bassa attività generale
#
# Esempio di calcolo:
# 100 utenti + 20 proposte*10 + 5000 voti/100 = 100 + 200 + 50 = 350 punti
#
# Cosa rivela del DAO:
# Bilancio delle metriche:
# - Alto = DAO sano con equilibrio tra crescita, creatività e partecipazione
# - Basso = DAO con problemi strutturali o bassa attività
#
# Evoluzione temporale:
# - Crescente = DAO in crescita sana su tutti i fronti
# - Plateau = DAO maturo, stabile
# - Decrescente = DAO in declino
#
# Nel grafico vedrai:
# - Linee in alto: Simulazioni con performance complessiva eccellente
# - Linee in basso: Simulazioni con performance limitata
# - Trend crescente: DAO che migliora su tutti gli aspetti
# - Volatilità: Instabilità nella crescita
#
# Perché è importante:
# - KPI master: Combina tutti gli aspetti in un singolo indicatore
# - Benchmark: Confronta facilmente diverse configurazioni
# - Decision making: Identifica la configurazione DAO ottimale
# ============================================================================
gnuplot << EOF
$common_clean_settings
set output './output/img/dao_comparison_CumulativePerformance.png'
set title 'Cumulative DAO Performance (Total Activity Score)'
set ylabel 'Cumulative Activity Score'
set key at screen 0.95, 0.05 right bottom box opaque font 'DejaVu Sans,13'

# Combined metric: Users + Proposals*10 + Votes/100
plot '$file1' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 4 lc '$color1' title '$sim1', \
    '$file2' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 4 lc '$color2' title '$sim2', \
    '$file3' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 3 lc '$color3' title '$sim3', \
    '$file4' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 3 lc '$color4' title '$sim4', \
    '$file5' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 3 lc '$color5' title '$sim5', \
    '$file6' using 1:(\$27 + \$17*10 + \$22/100) smooth bezier with lines lw 3 lc '$color6' title '$sim6'
EOF
