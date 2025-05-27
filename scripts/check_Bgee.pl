#!/usr/bin/env perl

# Perl embedded modules
use strict;
use warnings;
use diagnostics;

$| = 1;

use File::Slurp;
#use FindBin qw($RealBin);
use Getopt::Long;
use List::Util qw(shuffle);
use TAP::Harness;
use Test::More 'no_plan';
use Firefox::Marionette();

$ENV{'BASE_URL'} = 'https://www.bgee.org';

# Script options
my ($help, $debug, $shuffle)  = (0, 0, 0);
my ($sitemap_path)            = ('');
my ($check_url, $check_links) = (0, 0);
my ($specific_url)            = ('');
my ($check_content)           = ('');
my ($build_cache)             = (0);
my ($sleep_time)              = (1);
my %opts   = ('help|?'          => \$help,
              'debug|verbose'   => \$debug,
              'sitemap=s'       => \$sitemap_path,
              'shuffle'         => \$shuffle,
              'check_url'       => \$check_url,
              'check_links'     => \$check_links,
              'url=s'           => \$specific_url,
              'check_content=s' => \$check_content,
              'build_cache'     => \$build_cache,
              'sleep_time=i'    => \$sleep_time,
             );

my $test_options = Getopt::Long::GetOptions(%opts);
help()  if ( !$test_options || $help );
help()  if ( !$specific_url && !$check_url && !$check_links );


# Read sitemap URLs
my $firefox = Firefox::Marionette->new(
    binary         => '/home/smoretti/bin/firefox',
    set_javascript => 1,
    stealth        => 1,
    agent          => 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
#    page_load => '', # a shortcut to allow directly providing the page_load timeout, instead of needing to use timeouts from the capabilities parameter. Overrides all longer ways. the document to load or the session's page_load duration to elapse before returning, which, by default is 5 minutes.
#    survive => '', # if this is set to a true value, firefox will not automatically exit when the object goes out of scope. See the reconnect parameter for an experimental technique for reconnecting.
);
#use Data::Dumper;
#print Dumper $firefox->timeouts(), "\n";
my $URL;
my $url_count = 0;
#Read local sitemap files
if ( $sitemap_path && -e "$sitemap_path/sitemap.xml" ){
    my $content = read_file("$sitemap_path/sitemap.xml");
    my $sitemaps = parse_main_sitemap( $content );
    SITEMAP:
    for my $sitemap ( @$sitemaps ){
        my ($local_path) = $sitemap =~ m|$ENV{'BASE_URL'}/(sitemap_\w+\.xml)|;
        if ( -e "$sitemap_path/$local_path" ){
            my $content = read_file("$sitemap_path/$local_path");
            parse_sitemap( $content );
        }
        else {
            warn "\n\tCannot read [$sitemap_path/$local_path]\n\n";
        }
    }
}
#A specific URL
elsif ( $specific_url ne '' ){
    if ( $specific_url !~ /^$ENV{'BASE_URL'}/ ){
        die "\n\tInvalid URL [$specific_url] not in the $ENV{'BASE_URL'} domain\n\n";
    }

    $url_count++;
    push @{ $URL->{'specific'} }, $specific_url;
    $check_url = 1;
}
#Read remote sitemap files
else {
    my $sitemap_url = $ENV{'BASE_URL'}.'/sitemap.xml';
    $firefox->go("$sitemap_url");
    if ( $firefox->loaded() && $firefox->html() =~ m|<sitemap><loc>$ENV{'BASE_URL'}/sitemap_main\.xml</loc></sitemap>| ){
        my $sitemaps = parse_main_sitemap( $firefox->html() );
        SITEMAP:
        for my $sitemap ( @$sitemaps ){
            $firefox->go("$sitemap");
            if ( $firefox->loaded() && $firefox->html() =~ m|<url><loc>$ENV{'BASE_URL'}.*?</loc>| ){
                parse_sitemap( $firefox->html() );
            }
            else {
                warn "\n\tCannot reach [$sitemap]\n\n";
            }
        }
    }
    else {
        die "\n\tCannot reach [$sitemap_url]\n\n";
    }
}
warn "$url_count URLs\n"                                                          if $debug;
warn scalar keys %$URL, ' URL categories: ', join(', ', sort keys %$URL), "\n\n"  if $debug;


# Actions
$check_url = $check_links == 1 ? 1 : $check_url;
my %tests;
#Check Bgee URLs
if ( $check_url ){
    my @categories = $shuffle ? shuffle keys %$URL : sort keys %$URL;
    my $count = 0;
    CAT:
    for my $cat ( @categories ){
        my $CAT = sprintf('%03d', $count).$cat; # NOTE to be able to get always the same sorted key order at runtests!
        $tests{$CAT} = sub {
            plan tests => scalar @{ $URL->{$cat} };
            diag("\t[[[ $cat availability ]]]");
            URL:
            for my $url ( $shuffle ? shuffle @{ $URL->{$cat} } : @{ $URL->{$cat} } ){
                if ( $build_cache ){
                    my $filename = build_cache_filename($url);
                    if ( -e "$filename.html" && -s "$filename.html" ){
                        ok(1, "[$url] already there");
                        next URL;
                    }
                }
                $firefox->go("$url");
                #NOTE Firefox does not wait till the page is fully loaded (with ajax calls and everything). You have to search the DOM, and wait, with the async searched pattern
                #NOTE Test with data https://www.bgee.org/gene/ENSG00000130208, or without https://www.bgee.org/gene/ENSG00000277044
                #NOTE can be printed: print $firefox->await(...)->text();
                #NOTE pages without async calls should not execute the await !!!
                if ( $url =~ /^$ENV{'BASE_URL'}\/gene\// ){
                    #TODO  add a timeout!
                    $firefox->await(
                        # gene expression table xpath | no gene expression xpath (so on xrefs because longer to run and be retrieved)
                        sub { #$firefox->find('/html/body/div[3]/div/section/div/div[2]/div[3]/div[2]/button') &&
                              #NOTE the button is loaded quickly before the expression graph! Even if there is no data!
                              $firefox->find('/html/body/div[3]/div/section/div/div[2]/div[4]/div[4]/div/div/div/div') &&
                              $firefox->find('/html/body/div[3]/div/section/div/div[2]/div[5]/div[4]/div/div/div/div') &&
                              $firefox->find('/html/body/div[3]/div/section/div/div[2]/div[@id="xrefs"]/div/div/div');
                            }
                    );
                }
                elsif ( $url =~ /^$ENV{'BASE_URL'}\/experiment\// ){
                    $firefox->await(
                        # experiment table xpath
                        sub { $firefox->find('/html/body/div[3]/div/section/div/div[5]/table/thead/tr/th[1]/div'); }
                    );
                }
                my $status = 0;
                if ( $check_content =~ /\w/ ){
                    $status = $firefox->loaded() && $firefox->html() !~ /404 not found/ && $firefox->html() =~ m/$check_content/;
                }
                else {
                    $status = $firefox->loaded() && $firefox->html() !~ /404 not found/;
                }
                ok( $status, "[$url] loaded");
                if ( $status && $build_cache ){
                    #NOTE When writing the html, relative href/src paths have to be prefixed with $ENV{'BASE_URL'} but NOT the javascript!!!
                    my $html = $firefox->html();
                    $html =~ s{(<img[^>]*) src="/}{$1 src="$ENV{'BASE_URL'}/}g;
                    $html =~ s{ href="/}{ href="$ENV{'BASE_URL'}/}g;
                    my $filename = build_cache_filename($url);
                    write_file("$filename.html", {binmode => ':utf8'}, $html);
                }

                # Test page links
                if ( $check_links && $status ){
                    my %page_links;
                    map { $page_links{ $_->url_abs() }++ } $firefox->links();
                    #NOTE remove the URL to itself
                    delete( $page_links{ $specific_url} );
                    delete( $page_links{ "$specific_url#"} );
                    if ( $debug ){
                        warn "$_\t$page_links{ $_ }\n"  for sort keys %page_links;
                    }
                    #TODO
                }
                sleep $sleep_time  if ( !$specific_url );
            }
        };
        $count++;
    }
}


my $tester = TAP::Harness->new({
        timer       => 1,
        exec        => \&runner,
        verbosity   => 1,
        color       => 1,
});

$tester->runtests( sort keys %tests );

$firefox->quit();
exit 0;


sub help {
    print "\n$0 [options]
\t--check_url      Check Bgee URLs
\t--check_links    Check links in Bgee URLs [default: ".($check_links==0 ? 'False' : 'True')."]
\t--url            Check a specific Bgee URL [default: None]
\t--shuffle        Shuffle URLs to check [default: ".($shuffle==0 ? 'False' : 'True')."]
\t--sitemap        Directory of a local sitemap.xml file [default: Use the remote one]
\t--check_content  Pattern to search in page [default: None]
\t--build_cache    Write a result html file, per page, for a cache [default: ".($build_cache==0 ? 'False' : 'True')."]
\t--sleep_time     Time to sleep between elements of a list of URLs [default: $sleep_time second(s)]
\t--debug          Verbose/Debug mode
\t--help           This message\n\n";
    exit 1;
}

sub parse_main_sitemap {
    my ($sitemap_content) = @_;

    my @sitemaps;
    push @sitemaps, map  { m|<sitemap><loc>($ENV{'BASE_URL'}/sitemap_\w+\.xml)</loc>|; $1 }
                    grep { /$ENV{'BASE_URL'}/ }
                    split(/<\/sitemap>/, $sitemap_content);

    warn join("\n", @sitemaps), "\n"  if $debug;

    return \@sitemaps;
}

sub parse_sitemap {
    my ($sitemap_content) = @_;

    URL:
    for my $url_loc ( grep { /$ENV{'BASE_URL'}/ } split(/<\/url>/, $sitemap_content ) ){
        my ($url) = $url_loc =~ m|<loc>($ENV{'BASE_URL'}.*?)</loc>|;
        my ($dir) = $url     =~ m|$ENV{'BASE_URL'}/([^/]*)/.+|;
        $dir = $dir || 'main'; #NOTE if $dir is empty
        push @{ $URL->{$dir} }, $url;
        $url_count++;
    }

    return;
}

# From https://stackoverflow.com/questions/16584001/using-functions-in-tap-harness-instead-of-test-files
sub runner {
    my ($harness, $test) = @_;

    my $builder = Test::More->builder;

    # reset the Test::Builder object for every "file"
    $builder->reset;
    $builder->{Indent} = ''; # may not be needed

    # collect the output into $out
    $builder->output(\my($out));     # STDOUT
    $builder->failure_output(\$out); # STDERR
    $builder->todo_output(\$out);    # STDOUT

    # run the test
    $tests{$test}->();

    # the output ( needs at least one newline )
    return $out;
}

sub build_cache_filename {
    my ($url) = @_;

    my ($filename) = $url =~ m|$ENV{'BASE_URL'}/(.*)|;
    $filename = $filename || 'index';
    $filename =~ s{/}{--}g; #FIXME URLs with parameters, i.e. ?query=..., are not yet supported

    return $filename;
}

