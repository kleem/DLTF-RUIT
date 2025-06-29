#!/bin/zsh

# ============================================================================
# Input Files Configuration
# ============================================================================
file1="output/DAO-UniformProposal-DynamicVote_t1209600_aggr3600_20250628161039.tsv"
file2="output/DAO-UniformProposal-GartnerVote_t1209600_aggr3600_20250628161537.tsv"
file3="output/2peakUser_t1209600_aggr3600_20250628163123.tsv"
file4="output/DAO-2PeakUsers-and-Proposal_t1209600_aggr3600_20250628164018.tsv"
file5="output/DAO-peakOnProposal_t1209600_aggr3600_20250629085958.tsv"

# Check if files exist
for f in $file1 $file2 $file3 $file4 $file5; do
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

# ============================================================================
# Plot Users
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_Users_trend.png'
set title 'Users Comparison'
set ylabel 'Number of Users'

plot '$file1' using 1:2 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:2 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:2 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:2 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:2 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF

# ============================================================================
# Plot Proposals
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_Proposals_trend.png'
set title 'Proposals Comparison'
set ylabel 'Number of Proposals'

plot '$file1' using 1:3 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:3 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:3 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:3 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:3 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF

# ============================================================================
# Plot Votes
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_Votes_trend.png'
set title 'Votes Comparison'
set ylabel 'Number of Votes'

plot '$file1' using 1:4 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:4 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:4 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:4 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:4 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF

# ============================================================================
# Plot Average Users
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgUsers_trend.png'
set title 'Average Users Comparison'
set ylabel 'Average Number of Users'

plot '$file1' using 1:27 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:27 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:27 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:27 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:27 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF

# ============================================================================
# Plot Average Proposals
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgProposals_trend.png'
set title 'Average Proposals Comparison'
set ylabel 'Average Number of Proposals'

plot '$file1' using 1:17 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:17 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:17 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:17 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:17 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF

# ============================================================================
# Plot Average Votes
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgVotes_trend.png'
set title 'Average Votes Comparison'
set ylabel 'Average Number of Votes'

plot '$file1' using 1:22 smooth bezier with lines lw 3 lc 'forest-green' title 'Uniform Proposal Dynamic Vote', \
     '$file2' using 1:22 smooth bezier with lines lw 3 lc 'dark-orange' title 'Uniform Proposal Gartner Vote', \
     '$file3' using 1:22 smooth bezier with lines lw 3 lc 'purple' title 'Two Peaks User Vote Dynamic', \
     '$file4' using 1:22 smooth bezier with lines lw 3 lc 'red' title '2 Peak Users and Proposal', \
     '$file5' using 1:22 smooth bezier with lines lw 3 lc 'brown' title 'Peak On Proposal'
EOF



# ============================================================================
# Plot Average Users Per Run with Error Bars
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgUsersPerRun.png'
set title 'Average Users Per Run Comparison'
set ylabel 'Average Number of Users per Run'
set bars 4.0

# Plot filled curves with error bars
plot '$file1' using 1:27 smooth bezier with lines lw 3 lc rgb '#228B22' title 'Uniform Proposal Dynamic Vote', \
     '' using 1:27:(\$27-\$28):(\$27+\$28) with filledcurves lc rgb '#228B22' notitle, \
     '$file2' using 1:27 smooth bezier with lines lw 3 lc rgb '#FF8C00' title 'Uniform Proposal Gartner Vote', \
     '' using 1:27:(\$27-\$28):(\$27+\$28) with filledcurves lc rgb '#FF8C00' notitle, \
     '$file3' using 1:27 smooth bezier with lines lw 3 lc rgb '#9370DB' title 'Two Peaks User Vote Dynamic', \
     '' using 1:27:(\$27-\$28):(\$27+\$28) with filledcurves lc rgb '#9370DB' notitle, \
     '$file4' using 1:27 smooth bezier with lines lw 3 lc rgb '#DC143C' title '2 Peak Users and Proposal', \
     '' using 1:27:(\$27-\$28):(\$27+\$28) with filledcurves lc rgb '#DC143C' notitle, \
     '$file5' using 1:27 smooth bezier with lines lw 3 lc rgb '#8B4513' title 'Peak On Proposal', \
     '' using 1:27:(\$27-\$28):(\$27+\$28) with filledcurves lc rgb '#8B4513' notitle
EOF

# ============================================================================
# Plot Average Proposals Per Run with Error Bars
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgProposalsPerRun.png'
set title 'Average Proposals Per Run Comparison'
set ylabel 'Average Number of Proposals per Run'
set bars 4.0

# Plot filled curves with error bars
plot '$file1' using 1:17 smooth bezier with lines lw 3 lc rgb '#228B22' title 'Uniform Proposal Dynamic Vote', \
     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#228B22' notitle, \
     '$file2' using 1:17 smooth bezier with lines lw 3 lc rgb '#FF8C00' title 'Uniform Proposal Gartner Vote', \
     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#FF8C00' notitle, \
     '$file3' using 1:17 smooth bezier with lines lw 3 lc rgb '#9370DB' title 'Two Peaks User Vote Dynamic', \
     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#9370DB' notitle, \
     '$file4' using 1:17 smooth bezier with lines lw 3 lc rgb '#DC143C' title '2 Peak Users and Proposal', \
     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#DC143C' notitle, \
     '$file5' using 1:17 smooth bezier with lines lw 3 lc rgb '#8B4513' title 'Peak On Proposal', \
     '' using 1:17:(\$17-\$18):(\$17+\$18) with filledcurves lc rgb '#8B4513' notitle
EOF

# ============================================================================
# Plot Average Votes Per Run with Error Bars - IMPROVED READABILITY
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgVotesPerRun.png'
set title 'Average Votes Per Run Comparison'
set ylabel 'Average Number of Votes per Run'
set bars 4.0

# Improved settings for better readability
set style fill transparent solid 0.3
set key outside right center vertical box width 1.5
set key font 'Times-New-Roman,10'

# Use more distinct colors and add borders
plot '$file1' using 1:22 smooth bezier with lines lw 2 lc rgb '#1f77b4' title 'Uniform Dynamic', \
     '' using 1:22:(\$22-\$23):(\$22+\$23) with filledcurves lc rgb '#1f77b4' fs transparent solid 0.2 notitle, \
     '$file2' using 1:22 smooth bezier with lines lw 2 lc rgb '#ff7f0e' title 'Uniform Gartner', \
     '' using 1:22:(\$22-\$23):(\$22+\$23) with filledcurves lc rgb '#ff7f0e' fs transparent solid 0.2 notitle, \
     '$file3' using 1:22 smooth bezier with lines lw 2 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
     '' using 1:22:(\$22-\$23):(\$22+\$23) with filledcurves lc rgb '#2ca02c' fs transparent solid 0.2 notitle, \
     '$file4' using 1:22 smooth bezier with lines lw 2 lc rgb '#d62728' title '2 Peak Users+Prop', \
     '' using 1:22:(\$22-\$23):(\$22+\$23) with filledcurves lc rgb '#d62728' fs transparent solid 0.2 notitle, \
     '$file5' using 1:22 smooth bezier with lines lw 2 lc rgb '#9467bd' title 'Peak Proposal', \
     '' using 1:22:(\$22-\$23):(\$22+\$23) with filledcurves lc rgb '#9467bd' fs transparent solid 0.2 notitle
EOF

# ============================================================================
# Plot Average Votes Per Run - LINES ONLY VERSION (Alternative)
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgVotesPerRun_lines.png'
set title 'Average Votes Per Run Comparison (Lines Only)'
set ylabel 'Average Number of Votes per Run'
set bars 2.0

# Settings for line-only version
set key outside right center vertical box width 1.5
set key font 'Times-New-Roman,10'

# Plot with lines and error bars only
plot '$file1' using 1:22:23 with yerrorbars lw 2 pt 7 ps 0.5 lc rgb '#1f77b4' title 'Uniform Dynamic', \
     '' using 1:22 smooth bezier with lines lw 2 lc rgb '#1f77b4' notitle, \
     '$file2' using 1:22:23 with yerrorbars lw 2 pt 7 ps 0.5 lc rgb '#ff7f0e' title 'Uniform Gartner', \
     '' using 1:22 smooth bezier with lines lw 2 lc rgb '#ff7f0e' notitle, \
     '$file3' using 1:22:23 with yerrorbars lw 2 pt 7 ps 0.5 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
     '' using 1:22 smooth bezier with lines lw 2 lc rgb '#2ca02c' notitle, \
     '$file4' using 1:22:23 with yerrorbars lw 2 pt 7 ps 0.5 lc rgb '#d62728' title '2 Peak Users+Prop', \
     '' using 1:22 smooth bezier with lines lw 2 lc rgb '#d62728' notitle, \
     '$file5' using 1:22:23 with yerrorbars lw 2 pt 7 ps 0.5 lc rgb '#9467bd' title 'Peak Proposal', \
     '' using 1:22 smooth bezier with lines lw 2 lc rgb '#9467bd' notitle
EOF

# ============================================================================
# Plot Average Votes Per Run - LOG SCALE VERSION (for better readability)
# ============================================================================
gnuplot << EOF
$common_settings
set output './output/img/dao_comparison_AvgVotesPerRun_log.png'
set title 'Average Votes Per Run Comparison (Log Scale)'
set ylabel 'Average Number of Votes per Run (Log Scale)'
set logscale y
set bars 2.0

# Settings for log scale version
set key outside right center vertical box width 1.5
set key font 'Times-New-Roman,10'
set format y "10^{%T}"

# Plot with lines only for log scale
plot '$file1' using 1:22 smooth bezier with lines lw 3 lc rgb '#1f77b4' title 'Uniform Dynamic', \
     '$file2' using 1:22 smooth bezier with lines lw 3 lc rgb '#ff7f0e' title 'Uniform Gartner', \
     '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
     '$file4' using 1:22 smooth bezier with lines lw 3 lc rgb '#d62728' title '2 Peak Users+Prop', \
     '$file5' using 1:22 smooth bezier with lines lw 3 lc rgb '#9467bd' title 'Peak Proposal'
EOF


## ============================================================================
## Plot Average Votes Per Run - MULTI-PANEL VERSION
## ============================================================================
#gnuplot << EOF
#$common_settings
#set output './output/img/dao_comparison_AvgVotesPerRun_multipanel.png'
#set multiplot layout 2,1 title 'Average Votes Per Run - Multi-Panel View' font 'Times-New-Roman,18'
#
## Top panel - High performers
#set title 'High Vote Activity Scenarios' font 'Times-New-Roman,14'
#set ylabel 'Votes per Run' font 'Times-New-Roman,12'
#set yrange [0:150000]
#set key outside right center vertical box width 1.5
#set key font 'Times-New-Roman,9'
#
#plot '$file1' using 1:22 smooth bezier with lines lw 3 lc rgb '#1f77b4' title 'Uniform Dynamic', \
#     '$file2' using 1:22 smooth bezier with lines lw 3 lc rgb '#ff7f0e' title 'Uniform Gartner'
#
## Bottom panel - Lower performers
#set title 'Moderate Vote Activity Scenarios' font 'Times-New-Roman,14'
#set ylabel 'Votes per Run' font 'Times-New-Roman,12'
#set xlabel 'Time (days)' font 'Times-New-Roman,12'
#set yrange [0:20000]
#
#plot '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
#     '$file4' using 1:22 smooth bezier with lines lw 3 lc rgb '#d62728' title '2 Peak Users+Prop', \
#     '$file5' using 1:22 smooth bezier with lines lw 3 lc rgb '#9467bd' title 'Peak Proposal'
#
#unset multiplot
#EOF

## ============================================================================
## Plot Average Votes Per Run - ANNOTATED VERSION (with key insights)
## ============================================================================
#gnuplot << EOF
#$common_settings
#set output './output/img/dao_comparison_AvgVotesPerRun_annotated.png'
#set title 'Average Votes Per Run - Key Insights Highlighted'
#set ylabel 'Average Number of Votes per Run'
#set bars 2.0
#
## Settings for annotated version
#set key outside right center vertical box width 1.8
#set key font 'Times-New-Roman,9'
#
## Add annotations for key points
#set label 1 "Peak Activity" at 345600,120000 font 'Times-New-Roman,10' tc rgb 'red'
#set arrow 1 from 345600,115000 to 345600,130000 lc rgb 'red' lw 2
#
#set label 2 "Growth Phase" at 172800,50000 font 'Times-New-Roman,10' tc rgb 'blue'
#set arrow 2 from 172800,45000 to 259200,70000 lc rgb 'blue' lw 1
#
#set label 3 "Plateau" at 864000,15000 font 'Times-New-Roman,10' tc rgb 'green'
#
## Plot with enhanced visibility
#plot '$file1' using 1:22 smooth bezier with lines lw 4 lc rgb '#1f77b4' title 'Uniform Dynamic (Best)', \
#     '$file2' using 1:22 smooth bezier with lines lw 4 lc rgb '#ff7f0e' title 'Uniform Gartner (Good)', \
#     '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#2ca02c' title 'Two Peaks Dynamic', \
#     '$file4' using 1:22 smooth bezier with lines lw 2 lc rgb '#d62728' title '2 Peak Users+Prop', \
#     '$file5' using 1:22 smooth bezier with lines lw 2 lc rgb '#9467bd' title 'Peak Proposal'
#EOF

# ============================================================================
# Plot Average Votes Per Run - CLEAN MINIMAL VERSION
# ============================================================================
gnuplot << EOF
set terminal pngcairo enhanced size 1200,800 font 'Times-New-Roman,12'
set output './output/img/dao_comparison_AvgVotesPerRun_clean.png'
set title 'DAO Voting Activity Comparison' font 'Times-New-Roman,16'
set ylabel 'Average Votes per Run' font 'Times-New-Roman,14'
set xlabel 'Time (days)' font 'Times-New-Roman,14'

# Clean minimal settings
set grid xtics ytics lt 1 lc rgb '#e0e0e0' lw 1
set border 3 lw 2
set key top left box opaque font 'Times-New-Roman,11'
set xtics ('0' 0, '2d' 172800, '4d' 345600, '6d' 518400, '8d' 691200, '10d' 864000, '12d' 1036800, '14d' 1209600)
set yrange [0:*]

# High contrast colors for accessibility
plot '$file1' using 1:22 smooth bezier with lines lw 4 lc rgb '#000080' title 'Uniform Dynamic', \
     '$file2' using 1:22 smooth bezier with lines lw 4 lc rgb '#FF4500' title 'Uniform Gartner', \
     '$file3' using 1:22 smooth bezier with lines lw 3 lc rgb '#008000' title 'Two Peaks', \
     '$file4' using 1:22 smooth bezier with lines lw 3 lc rgb '#8B0000' title '2 Peak Users', \
     '$file5' using 1:22 smooth bezier with lines lw 3 lc rgb '#4B0082' title 'Peak Proposal'
EOF

echo "Generated improved plots for better readability!"
