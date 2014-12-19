require 'octokit'
require 'json'

Octokit.configure do |c|
  c.login = 'username'
  c.password = 'password'
  c.auto_paginate = true
end

# gets all public repos
repo_names = Octokit.repositories('asm-products').map(&:name)
puts "#{repo_names.length} repos"

puts "fetching participation_stats"

repo_stats = {}

repo_names.each do |r|
  puts "participation: #{r}"
  while (stat = Octokit.participation_stats("asm-products/#{r}")).nil?
    sleep(1)
  end
  repo_stats["r"] = stat
end

File.open("repo_stats.json","w") do |f|
  f.write(repo_stats.to_json)
end


puts "fetching code_frequency_stats"

adds_dels = {}

repo_names.each do |r|
  puts "code_frequency: #{r}"
  while (stats = Octokit.code_frequency_stats("asm-products/#{r}")).nil?
    sleep(1)
  end
  adds_dels[r] = stats
end

File.open("adds_dels.json","w") do |f|
  f.write(adds_dels.to_json)
end

puts "fetching contributors_stats"

leaders = {}

repo_names.each do |r|
  puts "contributors_stats: #{r}"
  while (stats = Octokit.contributors_stats("asm-products/#{r}")).nil?
    sleep(1)
  end
  leaders[r] = stats
end

File.open("leaders.json","w") do |f|
  f.write(leaders.to_json)
end
