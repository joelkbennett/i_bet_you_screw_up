helpers do
  # def current_user
  #   @current_user = User.find(session[:id]) if session[:id]
  # end

  def current_user
    @current_user = User.find(1)
  end

  def page_number
    @page_number = params[:page_number] || 1
  end

  def all_bets
    @bets = Bet.all
  end

  def a_promise(promise_id)
    @promise = Promise.find(promise_id)
  end

  def all_bets_on_a_promise(promise_id)
    @all_bets_on_a_promise = Bet.where("promise_id = ?", promise_id)
  end

  def user_of_the_promise(user_id)
    @user_of_the_promise = User.find(user_id)
  end

  def all_bets_of_a_user(user_id)
    @all_bets_of_a_user = Bet.where("user_id = ?", user_id)
  end

  def bet_for_a_user_on_a_promise(user_id, promise_id)
    @bet_for_a_user_on_a_promise = Bet.where("user_id = ? AND promise_id = ?", user_id, promise_id).take(1)[0]
  end

  def promise_expires_in
    @promise_expires_in = ((@promise.expires_at.to_time - Date.today.to_time) / 1.hours)
  end

  def total_users_for_the_promise_to_be_kept(promise_id)
    @total_users_for_the_promise_to_be_kept = Bet.where("promise_id = ? AND in_favour = true", promise_id).count
  end

  def total_users_against_the_promise_to_be_kept(promise_id)
    @total_users_against_the_promise_to_be_kept = Bet.where("promise_id = ? AND in_favour = false", promise_id).count
  end

end

before do
  current_user
  all_bets
end

get '/' do
  erb :index
end

get '/promises' do
  @promises = Promise.all.paginate(:page => page_number, :per_page => 20)
  erb :'promises/index'
end

get '/promises/new' do
  @promise = Promise.new
  erb :'promises/new'
end

get '/promises/:id' do |id|
  a_promise(id)
  user_of_the_promise(@promise.user_id)
  all_bets_on_a_promise(id)
  promise_expires_in
  total_users_for_the_promise_to_be_kept(id)
  total_users_against_the_promise_to_be_kept(id)
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  erb :'promises/show'
end

post '/promises/new' do
  promise = Promise.new(
    content: params[:content],
    expires_at: params[:expires_at],
    user_id: @current_user.id
  )
  if promise.save
    redirect "/promises/#{promise.id}"
  else
    redirect 'promises/new'
  end
end

post '/promises/:id/new_bet' do |id|
  a_promise(id)
  user_of_the_promise(@promise.user_id)
  total_users_for_the_promise_to_be_kept(id)
  p params
  bet_in_favour = true if params[:in_favour] =~ /Yes/
  bet_in_favour = false if params[:not_in_favour] =~ /No/
  @bet = Bet.new(
    bet_value: params[:bet_value],
    in_favour: bet_in_favour,
    user_id: @current_user.id,
    promise_id: id
  )
  @bet.save
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  redirect "/promises/#{id}"
end

post '/promises/:id/validate' do |id|
  a_promise(id)
  validation = true if params[:yes] == "Promise Kept"
  validation = false if params[:no] == "Promise Not Kept"
  @promise.update(validated: validation)
  redirect "/promises/#{id}"
end

get '/profile' do
  if @current_user
    erb :'users/profile'
  else
    redirect '/signup'
  end
end

post '/profile' do
  # TODO: route for updates to user profile
end

get '/users' do
  @users =  User.all.paginate(:page => page_number, :per_page => 20)
  erb :'users/index'
end

get '/users/:id' do
  @user = User.find(params[:id])
  erb :'users/show'
end

post '/login' do
  # TODO: route for logging in
end

get '/logout' do
  session[:id] = nil
  redirect "/promises"
end